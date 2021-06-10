import React, {ChangeEvent, FunctionComponent, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"

const RequestFunding: FunctionComponent = () => {
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

	return (
		<>
			<label htmlFor="request-funding-title">Title</label>
			<Input
				borders="all"
				id="request-funding-title"
				onChange={e => {
					setTitle(e.target.value)
				}}
				value={title}
			/>
			<label htmlFor="request-funding-desc">Description</label>
			<Input
				borders="all"
				id="request-funding-desc"
				onChange={e => {
					setDescription(e.target.value)
				}}
				value={description}
			/>
			<label htmlFor="request-funding-amount">Requested Amount</label>
			<Input borders="all" id="request-funding-amount" onChange={handleAmountChange} value={amount} />
			<label htmlFor="request-funding-recipient">Recipient</label>
			<Input
				borders="all"
				id="request-funding-recipient"
				onChange={e => {
					setRecipient(e.target.value)
				}}
				value={recipient}
			/>
			<Button>Create Proposal</Button>
		</>
	)
}

export default RequestFunding
