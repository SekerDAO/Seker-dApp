import React, {ChangeEvent, FunctionComponent, useContext, useState} from "react"
import Input from "../../Controls/Input"
import Button from "../../Controls/Button"
import {DAOMemberRole} from "../../../types/DAO"
import Select from "../../Controls/Select"
import {AuthContext} from "../../../context/AuthContext"
import EthersContext from "../../../context/EthersContext"
import addProposal from "../../../api/firebase/proposal/addProposal"
import {toastError, toastSuccess} from "../../Toast"
import {SafeSignature} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import {
	executeAddOwner,
	executeRemoveOwner,
	signAddOwner,
	signRemoveOwner
} from "../../../api/ethers/functions/gnosisSafe/addRemoveOwner"
import {ProposalState} from "../../../types/proposal"
import updateDAOUser from "../../../api/firebase/DAO/updateDaoUser"
import useDAO from "../../../customHooks/getters/useDAO"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import Loader from "../../Loader"

const ChangeRole: FunctionComponent<{
	gnosisAddress: string
	daoAddress?: string
	isAdmin: boolean
	gnosisVotingThreshold: number
}> = ({daoAddress, gnosisAddress, isAdmin, gnosisVotingThreshold}) => {
	const {dao, loading, error} = useDAO(gnosisAddress)
	const {account} = useContext(AuthContext)
	const {provider, signer} = useContext(EthersContext)
	const [processing, setProcessing] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const [address, setAddress] = useState("")
	const [newRole, setNewRole] = useState<DAOMemberRole | "kick" | "">("")
	const [newThreshold, setNewThreshold] = useState("")

	if (error) return <ErrorPlaceholder />
	if (!dao || loading) return <Loader />

	const handleThresholdChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.value && Number(e.target.value) < 1) {
			setNewThreshold("1")
		} else if (
			Number(e.target.value) >
			(newRole === "kick" ? gnosisVotingThreshold - 1 : gnosisVotingThreshold + 1)
		) {
			setNewThreshold(
				String(newRole === "kick" ? gnosisVotingThreshold - 1 : gnosisVotingThreshold + 1)
			)
		} else {
			setNewThreshold(e.target.value)
		}
	}

	const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
		if (e.target.value === "kick") {
			setAddress("")
		}
		setNewRole(e.target.value as "")
		if (Number(newThreshold) > gnosisVotingThreshold - 1) {
			setNewThreshold(String(gnosisVotingThreshold - 1))
		}
	}

	const handleSubmit = async () => {
		if (!(provider && signer && account && address && newRole)) return
		try {
			const member = dao.members.find(m => m.address === address.toLowerCase())
			if (newRole === "kick" && !member) {
				throw new Error("Member not exists")
			}
			if (newRole === "member" || (newRole === "kick" && member!.role === "member")) {
				// processing proposal for DAO module
				if (!daoAddress) return
				setProcessing(true)
				console.log("TODO")
				// const proposalId = await createERC20DAOChangeRoleProposal(
				// 	daoAddress,
				// 	newRole,
				// 	address,
				// 	provider,
				// 	signer
				// )
				// await addProposal({
				// 	id: proposalId,
				// 	type: "changeRole",
				// 	module: "DAO",
				// 	gnosisAddress,
				// 	userAddress: account,
				// 	title,
				// 	...(description ? {description} : {}),
				// 	recipientAddress: address,
				// 	newRole
				// })
				toastSuccess("Proposal successfully created")
			} else {
				// processing proposal for safe module
				if (!newThreshold || isNaN(Number(newThreshold))) return
				setProcessing(true)
				const signatures: SafeSignature[] = []
				let state: ProposalState = "active"
				if (isAdmin) {
					if (["admin", "head"].includes(newRole)) {
						// Processing add owner
						const newSignature = await signAddOwner(
							gnosisAddress,
							address,
							Number(newThreshold),
							signer
						)
						signatures.push(newSignature)
						if (gnosisVotingThreshold === 1) {
							await executeAddOwner(
								gnosisAddress,
								address,
								Number(newThreshold),
								signatures,
								signer
							)
							state = "executed"
							await updateDAOUser(gnosisAddress, address)
						}
					} else {
						// Processing remove owner
						const newSignature = await signRemoveOwner(
							gnosisAddress,
							address,
							Number(newThreshold),
							signer
						)
						signatures.push(newSignature)
						if (gnosisVotingThreshold === 1) {
							await executeRemoveOwner(
								gnosisAddress,
								address,
								Number(newThreshold),
								signatures,
								signer
							)
							state = "executed"
							await updateDAOUser(gnosisAddress, address)
						}
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
			}
			setTitle("")
			setDescription("")
			setAddress("")
			setNewRole("")
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
		setProcessing(false)
	}

	const thresholdRequired =
		newRole === "admin" ||
		(newRole === "kick" &&
			(!address || dao.members.find(m => m.address === address.toLowerCase())?.role === "admin"))

	const submitButtonDisabled =
		!(title && address && newRole) ||
		(thresholdRequired && (!newThreshold || isNaN(Number(newThreshold))))

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
					{newRole === "kick" ? (
						<Select
							options={[{name: "Choose one", value: ""}].concat(
								dao.members.map(m => ({name: m.address, value: m.address}))
							)}
							value={address}
							onChange={e => {
								setAddress(e.target.value)
							}}
						/>
					) : (
						<Input
							borders="all"
							id="change-role-address"
							value={address}
							onChange={e => {
								setAddress(e.target.value)
							}}
						/>
					)}
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
						onChange={handleRoleChange}
						value={newRole}
					/>
				</div>
			</div>
			{thresholdRequired && (
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
			<Button onClick={handleSubmit} disabled={processing || submitButtonDisabled}>
				{processing ? "Processing..." : "Create Proposal"}
			</Button>
		</>
	)
}

export default ChangeRole
