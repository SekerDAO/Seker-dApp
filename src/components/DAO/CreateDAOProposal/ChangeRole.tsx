import React, {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import {HouseDAORole} from "../../../types/DAO"
import Select from "../../Controls/Select"
import {AuthContext} from "../../../context/AuthContext"
import EthersContext from "../../../context/EthersContext"
import addProposal from "../../../api/firebase/proposal/addProposal"
import {toastError, toastSuccess} from "../../Toast"
import {createERC20DAOChangeRoleProposal} from "../../../api/ethers/functions/ERC20DAO/createERC20DAOProposals"
import {SafeSignature} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import {
	executeAddOwner,
	signAddOwner
} from "../../../api/ethers/functions/gnosisSafe/addRemoveOwner"
import {DAOState} from "../../../types/proposal"

const ChangeRole: FunctionComponent<{
	gnosisAddress: string
	daoAddress?: string
	isAdmin: boolean
	gnosisVotingThreshold: number
}> = ({daoAddress, gnosisAddress, isAdmin, gnosisVotingThreshold}) => {
	const {account} = useContext(AuthContext)
	const {provider, signer} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [address, setAddress] = useState("")
	const [newRole, setNewRole] = useState<HouseDAORole | "kick" | "">("")
	const [newThreshold, setNewThreshold] = useState("")

	const handleThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (Number(e.target.value) < 1) {
			setNewThreshold("1")
		} else if (Number(e.target.value) > gnosisVotingThreshold + 1) {
			setNewThreshold(String(gnosisVotingThreshold + 1))
		} else {
			setNewThreshold(e.target.value)
		}
	}

	const handleSubmit = async () => {
		if (!(provider && signer && account && address && newRole)) return
		try {
			if (newRole === "member") {
				// processing proposal for DAO module
				if (!daoAddress) return
				setLoading(true)
				const proposalId = await createERC20DAOChangeRoleProposal(
					daoAddress,
					newRole,
					address,
					provider,
					signer
				)
				await addProposal({
					id: proposalId,
					type: "changeRole",
					module: "DAO",
					gnosisAddress,
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
				setLoading(false)
			} else if (["admin", "head"].includes(newRole)) {
				// processing proposal for safe module
				if (!newThreshold || isNaN(Number(newThreshold))) return
				setLoading(true)
				const signatures: SafeSignature[] = []
				let state: DAOState = "active"
				if (isAdmin) {
					const newSignature = await signAddOwner(
						gnosisAddress,
						address,
						Number(newThreshold),
						provider,
						signer
					)
					signatures.push(newSignature)
					if (gnosisVotingThreshold === 1) {
						await executeAddOwner(gnosisAddress, address, Number(newThreshold), signatures, signer)
						state = "executed"
						// TODO: update firebase function for updating dao users and call it
					}
				}
				await addProposal({
					type: "changeRole",
					userAddress: account,
					module: "gnosis",
					gnosisAddress,
					title,
					...(description ? {description} : {}),
					recipientAddress: address,
					newThreshold: Number(newThreshold),
					newRole,
					signatures,
					state
				})
				toastSuccess("Proposal successfully created")
				setLoading(false)
			} else {
				// TODO: for kick we should check the old role to determine which module to call
				console.log("TODO: kick not implemented")
			}
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
	}

	// TODO: check old role and require new threshold if the old role is admin for kick
	const submitButtonDisabled =
		!(title && address && newRole) ||
		(["head", "admin"].includes(newRole) && (!newThreshold || isNaN(Number(newThreshold))))

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
							...(daoAddress ? [{name: "Member", value: "member"}] : []),
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
			{["admin", "head"].includes(newRole) && (
				<>
					<label htmlFor="change-role-threshold">New Threshold</label>
					<Input
						id="change-role-threshold"
						borders="all"
						number
						value={newThreshold}
						onChange={handleThresholdChange}
					/>
				</>
			)}
			<Button onClick={handleSubmit} disabled={loading || submitButtonDisabled}>
				{loading ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default ChangeRole
