import React, {FunctionComponent, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import {DAOMemberRole} from "../../../types/DAO"
import Select from "../../Controls/Select"

const ChangeRole: FunctionComponent = () => {
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [address, setAddress] = useState("")
	const [newRole, setNewRole] = useState<DAOMemberRole | "kick" | "">("")

	return (
		<>
			<label htmlFor="change-role-title">Title</label>
			<Input
				borders="all"
				id="change-role-title"
				onChange={e => {
					setTitle(e.target.value)
				}}
				value={title}
			/>
			<label htmlFor="change-role-desc">Description</label>
			<Input
				borders="all"
				id="change-role-desc"
				onChange={e => {
					setDescription(e.target.value)
				}}
				value={description}
			/>
			<div className="create-dao-proposal__row">
				<div className="create-dao-proposal__col">
					<label htmlFor="change-role-address">Member&apos;s Address</label>
					<Input
						borders="all"
						id="change-role-address"
						value={address}
						onChange={e => {
							setAddress(e.target.value)
						}}
					/>
				</div>
				<div className="create-dao-proposal__col">
					<label htmlFor="change-role-role">Proposed New Role</label>
					<Select
						options={[
							{name: "Choose One", value: ""},
							{name: "Member", value: "member"},
							{name: "Admin", value: "admin"},
							{name: "Contributor", value: "contributor"},
							{name: "Head", value: "head"},
							{name: "Kick", value: "kick"}
						]}
						onChange={e => {
							setNewRole(e.target.value as "")
						}}
						value={newRole}
					/>
				</div>
			</div>
			<Button>Create Proposal</Button>
		</>
	)
}

export default ChangeRole
