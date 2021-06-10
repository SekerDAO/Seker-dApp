import React, {ChangeEvent, FunctionComponent, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"

const ApplyForCommission: FunctionComponent = () => {
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
			<label htmlFor="apply-commission-title">Title</label>
			<Input
				borders="all"
				id="apply-commission-title"
				onChange={e => {
					setTitle(e.target.value)
				}}
				value={title}
			/>
			<label htmlFor="apply-commission-desc">Description</label>
			<Input
				borders="all"
				id="apply-commission-desc"
				onChange={e => {
					setDescription(e.target.value)
				}}
				value={description}
			/>
			<label htmlFor="apply-commission-amount">Requested Amount</label>
			<Input borders="all" id="apply-commission-amount" onChange={handleAmountChange} value={amount} />
			<label htmlFor="apply-commission-recipient">Recipient</label>
			<Input
				borders="all"
				id="apply-commission-recipient"
				onChange={e => {
					setRecipient(e.target.value)
				}}
				value={recipient}
			/>
			<div className="create-dao-proposal__separator" />
			<p className="create-dao-proposal__note">
				<b>Note:</b> This proposal will not be directly voted on by members but instead act as an informative post to
				the community. If it gains interest, a member of the house can choose to initiate a funding proposal.
			</p>
			<Button>Submit</Button>
		</>
	)
}

export default ApplyForCommission
