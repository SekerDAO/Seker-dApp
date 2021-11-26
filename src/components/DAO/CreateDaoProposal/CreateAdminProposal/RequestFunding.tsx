import {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import {AuthContext} from "../../../../context/AuthContext"
import EthersContext from "../../../../context/EthersContext"
import Button from "../../../Controls/Button"
import Input from "../../../Controls/Input"
import {toastError, toastSuccess} from "../../../UI/Toast"

const RequestFunding: FunctionComponent<{
	gnosisAddress: string
	daoAddress: string
}> = () => {
	const {account} = useContext(AuthContext)
	const {provider, signer} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [amount, setAmount] = useState("")
	const [recipient, setRecipient] = useState("")

	const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 0) {
			setAmount("0")
		} else {
			setAmount(e.target.value)
		}
	}

	const handleSubmit = async () => {
		if (!(provider && signer && account && amount && recipient)) return
		setLoading(true)
		try {
			console.log("TODO")
			// const proposalId = await createERC20DAOFundingProposal(
			// 	daoAddress,
			// 	recipient,
			// 	Number(amount),
			// 	provider,
			// 	signer
			// )
			// await addProposal({
			// 	id: proposalId,
			// 	type: "requestFunding",
			// 	module: "DAO",
			// 	gnosisAddress,
			// 	userAddress: account,
			// 	title,
			// 	...(description ? {description} : {}),
			// 	recipientAddress: recipient,
			// 	amount: Number(amount)
			// })
			toastSuccess("Proposal successfully created")
			setTitle("")
			setDescription("")
			setAmount("")
			setRecipient("")
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
		setLoading(false)
	}

	return (
		<>
			<label htmlFor="request-funding-title">Title</label>
			<Input
				id="request-funding-title"
				onChange={e => {
					setTitle(e.target.value)
				}}
				value={title}
			/>
			<label htmlFor="request-funding-desc">Description</label>
			<Input
				id="request-funding-desc"
				onChange={e => {
					setDescription(e.target.value)
				}}
				value={description}
			/>
			<label htmlFor="request-funding-amount">Requested Amount</label>
			<Input id="request-funding-amount" onChange={handleAmountChange} value={amount} number />
			<label htmlFor="request-funding-recipient">Recipient</label>
			<Input
				id="request-funding-recipient"
				onChange={e => {
					setRecipient(e.target.value)
				}}
				value={recipient}
			/>
			<Button
				onClick={handleSubmit}
				disabled={loading || !(title && amount && recipient)}
				extraClassName="create-dao-proposal__submit-button"
			>
				{loading ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default RequestFunding
