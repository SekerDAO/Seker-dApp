import React, {FunctionComponent, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"

const JoinHouse: FunctionComponent = () => {
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")

	return (
		<>
			<label htmlFor="join-house-title">Title</label>
			<Input
				borders="all"
				id="join-house-title"
				onChange={e => {
					setTitle(e.target.value)
				}}
				value={title}
			/>
			<label htmlFor="join-house-desc">Description</label>
			<Input
				borders="all"
				id="join-house-desc"
				onChange={e => {
					setDescription(e.target.value)
				}}
				value={description}
			/>
			<p className="create-dao-proposal__note">The minimum contribution amount is: TODO</p>
			<Button>Create Proposal</Button>
		</>
	)
}

export default JoinHouse
