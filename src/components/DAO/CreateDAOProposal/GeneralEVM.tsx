import React, {
	ChangeEvent,
	Fragment,
	FunctionComponent,
	useContext,
	useEffect,
	useState
} from "react"
import Input from "../../Controls/Input"
import {isAddress} from "@ethersproject/address"
import {toastError, toastSuccess, toastWarning} from "../../Toast"
import fetchContractAbi from "../../../api/etherscan/fetchContractAbi"
import Textarea from "../../Controls/Textarea"
import {Abi, AbiFunction} from "../../../types/abi"
import Select from "../../Controls/Select"
import {prepareArguments, validateArgument} from "../../../utlls"
import Button from "../../Controls/Button"
import {
	createSafeSignature,
	executeSafeTx,
	SafeSignature
} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import {ProposalState} from "../../../types/proposal"
import EthersContext from "../../../context/EthersContext"
import addProposal from "../../../api/firebase/proposal/addProposal"
import {AuthContext} from "../../../context/AuthContext"

const GeneralEVM: FunctionComponent<{
	gnosisAddress: string
	isAdmin: boolean
	gnosisVotingThreshold: number
}> = ({gnosisAddress, gnosisVotingThreshold, isAdmin}) => {
	const {account} = useContext(AuthContext)
	const {signer} = useContext(EthersContext)
	const [processing, setProcessing] = useState(false)

	const [title, setTitle] = useState("")
	const [address, setAddress] = useState("")
	const [addressBad, setAddressBad] = useState(false)

	const [abiString, setAbiString] = useState("")
	const [abiBad, setAbiBad] = useState(false)
	const [fetchingAbi, setFetchingAbi] = useState(false)
	const [contractMethods, setContractMethods] = useState<AbiFunction[]>([])
	useEffect(() => {
		if (abiString) {
			try {
				const abi: Abi = JSON.parse(abiString)
				const functions = abi.filter(
					f => f.type === "function" && ["payable", "nonpayable"].includes(f.stateMutability)
				) as AbiFunction[]
				setContractMethods(functions)
				setAbiBad(false)
			} catch (e) {
				setAbiBad(true)
				setContractMethods([])
				setSelectedMethodIndex(null)
			}
		} else {
			setAbiBad(false)
		}
	}, [abiString])

	const [selectedMethodIndex, setSelectedMethodIndex] = useState<number | null>(null)
	const [args, setArgs] = useState<string[]>([])
	const [argsBad, setArgsBad] = useState<boolean[]>([])
	useEffect(() => {
		if (selectedMethodIndex != null) {
			setArgs(contractMethods[selectedMethodIndex].inputs.map(() => ""))
			setArgsBad(contractMethods[selectedMethodIndex].inputs.map(() => false))
		} else {
			setArgs([])
			setArgsBad([])
		}
	}, [selectedMethodIndex])

	const handleAddressChange = async (e: ChangeEvent<HTMLInputElement>) => {
		setAddress(e.target.value)
		setAddressBad(!!(e.target.value && !isAddress(e.target.value)))
		if (isAddress(e.target.value)) {
			setFetchingAbi(true)
			try {
				const abi = await fetchContractAbi(e.target.value)
				setAbiString(abi)
			} catch (err) {
				console.error(err)
				toastWarning("Could not get contract ABI")
			}
			setFetchingAbi(false)
		}
	}

	const handleArgumentChange = (value: string, index: number) => {
		if (selectedMethodIndex == null) return
		setArgs(prevState => prevState.map((item, idx) => (idx === index ? value : item)))
		setArgsBad(prevState =>
			prevState.map((item, idx) =>
				idx === index
					? !validateArgument(value, contractMethods[selectedMethodIndex].inputs[index].type)
					: false
			)
		)
	}

	const handleSubmit = async () => {
		if (!(selectedMethodIndex != null && signer && account)) return
		setProcessing(true)
		try {
			const signatures: SafeSignature[] = []
			let state: ProposalState = "active"
			if (isAdmin) {
				const signature = await createSafeSignature(
					gnosisAddress,
					address,
					contractMethods,
					contractMethods[selectedMethodIndex].name,
					prepareArguments(
						args,
						contractMethods[selectedMethodIndex].inputs.map(i => i.type)
					),
					signer
				)
				signatures.push(signature)
				if (gnosisVotingThreshold === 1) {
					await executeSafeTx(
						gnosisAddress,
						address,
						contractMethods,
						contractMethods[selectedMethodIndex].name,
						prepareArguments(
							args,
							contractMethods[selectedMethodIndex].inputs.map(i => i.type)
						),
						signer,
						signatures
					)
					state = "executed"
				}
			}
			await addProposal({
				type: "generalEVM",
				module: "gnosis",
				userAddress: account,
				title,
				gnosisAddress,
				signatures,
				state,
				contractAddress: address,
				contractAbi: contractMethods,
				contractMethod: contractMethods[selectedMethodIndex].name,
				callArgs: args.reduce(
					(acc, cur, index) => ({
						...acc,
						[contractMethods[selectedMethodIndex].inputs[index].name]: cur
					}),
					{}
				)
			})
			toastSuccess("Proposal successfully created!")
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
		setProcessing(false)
	}

	const submitButtonDisabled =
		!title ||
		!address ||
		addressBad ||
		!abiString ||
		abiBad ||
		selectedMethodIndex == null ||
		!args.reduce((acc, cur) => acc && !!cur, true) ||
		argsBad.reduce((acc, cur) => acc && cur, true)

	return (
		<>
			<label htmlFor="general-evm-title">Proposal Title</label>
			<Input
				id="general-evm-title"
				borders="all"
				value={title}
				onChange={e => {
					setTitle(e.target.value)
				}}
			/>
			<label htmlFor="general-evm-address">Contract Address</label>
			<Input
				id="general-evm-address"
				borders="all"
				value={address}
				onChange={handleAddressChange}
				validation={addressBad ? "Not a valid address" : null}
			/>
			{fetchingAbi && <p>TODO: fetching ABI...</p>}
			<label htmlFor="general-evm-abi">ABI</label>
			<Textarea
				borders="all"
				value={abiString}
				onChange={e => {
					setAbiString(e.target.value)
				}}
				validation={abiBad ? "ABI is malformed" : null}
			/>
			{abiString && !abiBad && (
				<>
					<label>Select Method</label>
					<Select
						value={selectedMethodIndex != null ? String(selectedMethodIndex) : ""}
						options={[{name: "Choose One", value: ""}].concat(
							contractMethods.map((method, index) => ({name: method.name, value: String(index)}))
						)}
						onChange={e => {
							setSelectedMethodIndex(e.target.value === "" ? null : Number(e.target.value))
						}}
						fullWidth
					/>
					{selectedMethodIndex != null && (
						<>
							{contractMethods[selectedMethodIndex].inputs.map((input, index) => (
								<Fragment key={index}>
									<label>{`${input.name} (${input.type})`}</label>
									{input.type.endsWith("[]") && <p>TODO: Use comma as separator</p>}
									{input.type === "bool" ? (
										<Select
											fullWidth
											options={[
												{name: "true", value: "true"},
												{name: "false", value: "false"}
											]}
											value={args[index] ?? ""}
											onChange={e => {
												handleArgumentChange(e.target.value, index)
											}}
										/>
									) : (
										<Input
											borders="all"
											value={args[index] ?? ""}
											onChange={e => {
												handleArgumentChange(e.target.value, index)
											}}
											validation={argsBad[index] ? `Bad value for type ${input.type}` : null}
										/>
									)}
								</Fragment>
							))}
							<Button disabled={submitButtonDisabled || processing} onClick={handleSubmit}>
								{processing ? "Processing..." : "Create Proposal"}
							</Button>
						</>
					)}
				</>
			)}
		</>
	)
}

export default GeneralEVM
