import React, {FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import {HouseDAORole} from "../../../types/DAO"
import Select from "../../Controls/Select"
import {AuthContext} from "../../../context/AuthContext"
import EthersContext from "../../../context/EthersContext"
import addProposal from "../../../api/firebase/proposal/addProposal"
import {toastError, toastSuccess} from "../../Toast"
import {createERC20DAOChangeRoleProposal} from "../../../api/ethers/functions/ERC20DAO/createERC20DAOProposals"

const ChangeRole: FunctionComponent<{
	daoAddress: string
}> = ({daoAddress}) => {
	const {account} = useContext(AuthContext)
	const {provider, signer} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [address, setAddress] = useState("")
	const [newRole, setNewRole] = useState<HouseDAORole | "kick" | "">("")

	const handleSubmit = async () => {
		if (!(provider && signer && account && address && newRole)) return
		setLoading(true)
		try {
			const proposalId = await createERC20DAOChangeRoleProposal(daoAddress, newRole, address, provider, signer)
			await addProposal({
				id: proposalId,
				type: "changeRole",
				daoAddress,
				userAddress: account,
				title,
				...(description ? {description} : {}),
				recipientAddress: address,
				newRole
			})
			toastSuccess("Proposal successfully created")
			setTitle("")
			setDescription("")
			setAddress("")
			setNewRole("")
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
		setLoading(false)
	}

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
			<Button onClick={handleSubmit} disabled={loading || !(title && address && newRole)}>
				{loading ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default ChangeRole
