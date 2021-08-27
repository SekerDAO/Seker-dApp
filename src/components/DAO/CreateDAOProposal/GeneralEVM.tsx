import React, {ChangeEvent, Fragment, FunctionComponent, useEffect, useState} from "react"
import Input from "../../Controls/Input"
import {isAddress} from "@ethersproject/address"
import {toastWarning} from "../../Toast"
import fetchContractAbi from "../../../api/etherscan/fetchContractAbi"
import Textarea from "../../Controls/Textarea"
import {Abi, AbiFunction} from "../../../types/abi"
import Select from "../../Controls/Select"
import {validateArgument} from "../../../utlls"
import Button from "../../Controls/Button"

const GeneralEVM: FunctionComponent = () => {
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
		if (selectedMethodIndex) {
			setArgs(contractMethods[selectedMethodIndex].inputs.map(() => ""))
			setArgsBad(contractMethods[selectedMethodIndex].inputs.map(() => false))
		} else {
			setArgs([])
			setArgsBad([])
		}
	}, [selectedMethodIndex])

	const handleAddressChange = async (e: ChangeEvent<HTMLInputElement>) => {
		setAddress(e.target.value)
		setAddressBad(!!(address && !isAddress(address)))
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

	const handleSubmit = () => {
		console.log("TODO")
	}

	const submitButtonDisabled =
		!address ||
		addressBad ||
		!abiString ||
		abiBad ||
		!selectedMethodIndex ||
		!args.reduce((acc, cur) => acc && !!cur, true) ||
		argsBad.reduce((acc, cur) => acc && cur, true)

	return (
		<>
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
						value={selectedMethodIndex ? String(selectedMethodIndex) : ""}
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
							<Button disabled={submitButtonDisabled} onClick={handleSubmit}>
								Create Proposal
							</Button>
						</>
					)}
				</>
			)}
		</>
	)
}

export default GeneralEVM
