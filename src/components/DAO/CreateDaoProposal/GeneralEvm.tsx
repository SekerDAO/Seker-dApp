import {isAddress} from "@ethersproject/address"
import {ChangeEvent, Fragment, FunctionComponent, useEffect, useState} from "react"
import fetchContractAbi from "../../../api/etherscan/fetchContractAbi"
import {ReactComponent as CloseIcon} from "../../../assets/icons/delete.svg"
import {Abi, AbiFunction} from "../../../types/abi"
import {PrebuiltTx} from "../../../types/common"
import {validateArgument} from "../../../utlls"
import ArrayInput from "../../Controls/ArrayInput"
import Button from "../../Controls/Button"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"
import Textarea from "../../Controls/Textarea"
import Paper from "../../UI/Paper"
import {toastWarning} from "../../UI/Toast"

const SingleTransaction: FunctionComponent<
	Omit<PrebuiltTx, "selectedMethodIndex"> & {
		title: string
		selectedMethodIndex: number | null
		onAddressChange: (newAddress: string) => void
		addressBad: boolean
		onContractMethodsChange: (newMethods: AbiFunction[]) => void
		onSelectedMethodIndexChange: (newIndex: number | null) => void
		onArrayArgAdd: (value: string, index: number) => void
		onArrayArgRemove: (indexToRemove: number, argIndex: number) => void
		onArgChange: (value: string, index: number) => void
		argsBad: boolean[]
		onTransactionRemove?: () => void
	}
> = ({
	title,
	address,
	onAddressChange,
	addressBad,
	contractMethods,
	onContractMethodsChange,
	selectedMethodIndex,
	onSelectedMethodIndexChange,
	args,
	onArrayArgAdd,
	onArgChange,
	onArrayArgRemove,
	argsBad,
	onTransactionRemove
}) => {
	const [fetchingAbi, setFetchingAbi] = useState(false)
	const [abiString, setAbiString] = useState("")
	const [abiBad, setAbiBad] = useState(false)
	useEffect(() => {
		if (abiString) {
			try {
				const abi: Abi = JSON.parse(abiString)
				const functions = abi.filter(
					f => f.type === "function" && ["payable", "nonpayable"].includes(f.stateMutability)
				) as AbiFunction[]
				onContractMethodsChange(functions)
				setAbiBad(false)
			} catch (e) {
				setAbiBad(true)
				onContractMethodsChange([])
			}
		} else {
			setAbiBad(false)
		}
	}, [abiString])

	const handleAddressChange = async (e: ChangeEvent<HTMLInputElement>) => {
		onAddressChange(e.target.value)
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

	return (
		<Paper>
			<h2>{title}</h2>
			{onTransactionRemove && (
				<span onClick={onTransactionRemove} className="create-dao-proposal__delete">
					<CloseIcon />
				</span>
			)}
			<label htmlFor="general-evm-address">Contract Address</label>
			<Input
				id="general-evm-address"
				value={address}
				onChange={handleAddressChange}
				validation={addressBad ? "Not a valid address" : null}
			/>
			{fetchingAbi && <p>Fetching ABI...</p>}
			<label htmlFor="general-evm-abi">ABI</label>
			<Textarea
				value={abiString}
				onChange={e => {
					setAbiString(e.target.value)
				}}
				validation={abiBad ? "ABI is malformed" : null}
			/>
			{abiString && !abiBad && (
				<>
					<label>Select Method</label>
					<Select<number>
						placeholder="Choose One"
						value={selectedMethodIndex ?? null}
						options={contractMethods.map((method, index) => ({
							name: method.name,
							value: index
						}))}
						onChange={newSelectedMethodIndex => {
							onSelectedMethodIndexChange(newSelectedMethodIndex ?? null)
						}}
						fullWidth
					/>
					{selectedMethodIndex != null && (
						<>
							{contractMethods[selectedMethodIndex].inputs.map((input, index) => (
								<Fragment key={index}>
									<label>{`${input.name} (${input.type})`}</label>
									{input.type.endsWith("[]") ? (
										<ArrayInput
											onRemove={(indexToRemove: number) => {
												onArrayArgRemove(indexToRemove, index)
											}}
											onAdd={(newValue: string) => {
												onArrayArgAdd(newValue, index)
											}}
											items={(args.find((arg, idx) => idx === index) as string[]) || []}
											validator={(value: string) =>
												validateArgument([value], input.type)
													? null
													: `Bad value for type ${input.type}`
											}
										/>
									) : input.type === "bool" ? (
										<Select<string>
											placeholder="Select value"
											fullWidth
											options={[
												{name: "true", value: "true"},
												{name: "false", value: "false"}
											]}
											value={(args[index] as string) ?? ""}
											onChange={newValue => {
												onArgChange(newValue, index)
											}}
										/>
									) : (
										<Input
											value={args[index] ?? ""}
											onChange={e => {
												onArgChange(e.target.value, index)
											}}
											validation={argsBad[index] ? `Bad value for type ${input.type}` : null}
										/>
									)}
								</Fragment>
							))}
						</>
					)}
				</>
			)}
		</Paper>
	)
}

const GeneralEvm: FunctionComponent<{
	buttonDisabled: boolean
	processing: boolean
	onSubmit: (transactions: PrebuiltTx[]) => void
}> = ({buttonDisabled, processing, onSubmit}) => {
	const [txKeys, setTxKeys] = useState([Math.random()])
	const [addresses, setAddresses] = useState([""])
	const [addressesBad, setAddressesBad] = useState([false])
	const [contractsMethods, setContractsMethods] = useState<AbiFunction[][]>([[]])
	const [selectedMethodIndexes, setSelectedMethodIndexes] = useState<(number | null)[]>([null])
	const [args, setArgs] = useState<(string | string[])[][]>([[]])
	const [argsBad, setArgsBad] = useState<boolean[][]>([[]])

	const handleAddressChange = (newAddress: string, txIndex: number) => {
		setAddresses(prevState =>
			prevState.map((oldAddress, index) => (index === txIndex ? newAddress : oldAddress))
		)
		setAddressesBad(prevState =>
			prevState.map((oldAddressBad, index) =>
				index === txIndex ? !!(newAddress && !isAddress(newAddress)) : oldAddressBad
			)
		)
	}

	const handleSelectedMethodIndexChange = (newIndex: number | null, txIndex: number) => {
		setSelectedMethodIndexes(prevState =>
			prevState.map((oldMethodIndex, index) => (index === txIndex ? newIndex : oldMethodIndex))
		)
		setArgs(prevState =>
			prevState.map((oldArgs, index) =>
				index === txIndex
					? newIndex === null
						? []
						: contractsMethods[index][newIndex].inputs.map(input =>
								input.type.endsWith("[]") ? [] : ""
						  )
					: oldArgs
			)
		)
		setArgsBad(prevState =>
			prevState.map((oldArgsBad, index) =>
				index === txIndex
					? newIndex === null
						? []
						: contractsMethods[index][newIndex].inputs.map(() => false)
					: oldArgsBad
			)
		)
	}

	const handleContractMethodsChange = (newMethods: AbiFunction[], txIndex: number) => {
		setContractsMethods(prevState =>
			prevState.map((oldMethods, index) => (index === txIndex ? newMethods : oldMethods))
		)
		handleSelectedMethodIndexChange(null, txIndex)
	}

	const handleArrayArgumentAdd = (newArg: string, argsIndex: number, txIndex: number) => {
		if (selectedMethodIndexes[txIndex] == null) return
		setArgs(prevState =>
			prevState.map((oldArgs, index) =>
				index === txIndex
					? oldArgs.map((arg, idx) =>
							idx === argsIndex && arg instanceof Array ? [...arg, newArg] : arg
					  )
					: oldArgs
			)
		)
	}

	const handleArrayArgumentRemove = (indexToRemove: number, argsIndex: number, txIndex: number) => {
		if (selectedMethodIndexes[txIndex] == null) return
		setArgs(prevState =>
			prevState.map((oldArgs, index) =>
				index === txIndex
					? oldArgs.map((arg, idx) =>
							argsIndex === idx && arg instanceof Array
								? arg.filter((option, optionIndex) => optionIndex !== indexToRemove)
								: arg
					  )
					: oldArgs
			)
		)
	}

	const handleArgumentChange = (value: string, argIndex: number, txIndex: number) => {
		if (selectedMethodIndexes[txIndex] == null) return
		setArgs(prevState =>
			prevState.map((oldArgs, index) =>
				index === txIndex ? oldArgs.map((arg, idx) => (idx === argIndex ? value : arg)) : oldArgs
			)
		)
		setArgsBad(prevState =>
			prevState.map((oldArgsBad, index) =>
				index === txIndex
					? oldArgsBad.map((argBad, idx) =>
							idx === argIndex
								? !validateArgument(
										value,
										contractsMethods[txIndex][selectedMethodIndexes[txIndex]!].inputs[argIndex].type
								  )
								: argBad
					  )
					: oldArgsBad
			)
		)
	}

	const handleTxAdd = () => {
		setAddressesBad(prevState => [...prevState, false])
		setContractsMethods(prevState => [...prevState, []])
		setSelectedMethodIndexes(prevState => [...prevState, null])
		setArgs(prevState => [...prevState, []])
		setArgsBad(prevState => [...prevState, []])
		setTxKeys(prevState => [...prevState, Math.random()])
		setAddresses(prevState => [...prevState, ""])
	}

	const handleTxRemove = (txIndex: number) => {
		setAddressesBad(prevState => prevState.filter((item, index) => index !== txIndex))
		setContractsMethods(prevState => prevState.filter((item, index) => index !== txIndex))
		setSelectedMethodIndexes(prevState => prevState.filter((item, index) => index !== txIndex))
		setArgs(prevState => prevState.filter((item, index) => index !== txIndex))
		setArgsBad(prevState => prevState.filter((item, index) => index !== txIndex))
		setTxKeys(prevState => prevState.filter((item, index) => index !== txIndex))
		setAddresses(prevState => prevState.filter((item, index) => index !== txIndex))
	}

	const handleSubmit = () => {
		onSubmit(
			addresses.map((address, index) => ({
				address,
				contractMethods: contractsMethods[index],
				selectedMethodIndex: selectedMethodIndexes[index]!,
				args: args[index]
			}))
		)
	}

	const submitButtonDisabled =
		buttonDisabled ||
		!addresses.reduce((acc: boolean, cur: string) => acc && !!cur, true) ||
		addressesBad.reduce((acc, cur) => acc || cur, false) ||
		!contractsMethods.reduce((acc, cur) => acc && cur.length > 0, true) ||
		!selectedMethodIndexes.reduce((acc, cur) => acc && cur !== null, true) ||
		!args.reduce(
			(txAcc, txCur) => txAcc && txCur.reduce((argAcc, argCur) => argAcc && !!argCur, true),
			true
		) ||
		argsBad.reduce(
			(txAcc: boolean, txCur: boolean[]) =>
				txAcc || txCur.reduce((argAcc, argCur) => argAcc || argCur, false),
			false
		)

	return (
		<>
			{addresses.map((address, txIndex) => (
				<SingleTransaction
					key={txKeys[txIndex]}
					title={`Action ${txIndex + 1}`}
					address={address}
					contractMethods={contractsMethods[txIndex]}
					selectedMethodIndex={selectedMethodIndexes[txIndex]}
					args={args[txIndex]}
					onAddressChange={newAddress => {
						handleAddressChange(newAddress, txIndex)
					}}
					addressBad={addressesBad[txIndex]}
					onContractMethodsChange={newMethods => {
						handleContractMethodsChange(newMethods, txIndex)
					}}
					onSelectedMethodIndexChange={newIndex => {
						handleSelectedMethodIndexChange(newIndex, txIndex)
					}}
					onArrayArgAdd={(value, argIndex) => {
						handleArrayArgumentAdd(value, argIndex, txIndex)
					}}
					onArrayArgRemove={(indexToRemove, argIndex) => {
						handleArrayArgumentRemove(indexToRemove, argIndex, txIndex)
					}}
					onArgChange={(value, argIndex) => {
						handleArgumentChange(value, argIndex, txIndex)
					}}
					argsBad={argsBad[txIndex]}
					onTransactionRemove={
						addresses.length > 1
							? () => {
									handleTxRemove(txIndex)
							  }
							: undefined
					}
				/>
			))}
			<Button
				buttonType="secondary"
				extraClassName="create-dao-proposal__add-button"
				onClick={handleTxAdd}
			>
				Add Action
			</Button>
			<Button
				disabled={submitButtonDisabled || processing}
				onClick={handleSubmit}
				extraClassName="create-dao-proposal__submit-button"
			>
				{processing ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default GeneralEvm
