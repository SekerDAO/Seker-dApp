import {FunctionComponent, useContext, useState} from "react"
import Select from "../../Controls/Select"
import "./styles.scss"
import ChangeRole from "./ChangeRole"
import {AuthContext} from "../../../context/AuthContext"
import {SafeProposalsTypeNames, SafeProposalType} from "../../../types/safeProposal"
import CreateAuction from "./CreateAuction"
import CancelAuction from "./CancelAuction"
import useDAOProposals from "../../../hooks/getters/useDAOProposals"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import Loader from "../../Loader"
import GeneralEVM from "./GeneralEVM"
import Input from "../../Controls/Input"
import Divider from "../../Divider"

const CreateDaoAdminProposal: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	ownersCount: number
}> = ({gnosisAddress, gnosisVotingThreshold, ownersCount}) => {
	const {connected} = useContext(AuthContext)
	const [type, setType] = useState<SafeProposalType>("changeRole")
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const {proposals, loading, error} = useDAOProposals(gnosisAddress)

	if (error) return <ErrorPlaceholder />
	if (loading) return <Loader />

	if (proposals?.filter(p => p.state === "active").length > 0)
		return (
			<div>
				TODO: This DAO already has an active proposal. No more than 1 proposal at a time can be
				created.
			</div>
		)
	if (!connected) return <div>TODO: Please connect wallet</div>

	const afterSubmit = () => {
		setTitle("")
		setDescription("")
	}

	return (
		<div className="create-dao-proposal">
			<h2>Create a New Proposal</h2>
			<label>Safe proposal type</label>
			<Select
				placeholder="Choose safe proposal type"
				value={type}
				options={[
					{name: SafeProposalsTypeNames.changeRole, value: "changeRole"},
					{name: SafeProposalsTypeNames.createAuction, value: "createAuction"},
					{name: SafeProposalsTypeNames.cancelAuction, value: "cancelAuction"},
					{name: SafeProposalsTypeNames.endAuction, value: "endAuction"},
					{name: SafeProposalsTypeNames.generalEVM, value: "generalEVM"}
				]}
				onChange={newSafeProposalType => {
					setType(newSafeProposalType as SafeProposalType)
				}}
			/>
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
			<Divider />
			{/*{type === "joinHouse" && daoAddress && (*/}
			{/*	<JoinHouse gnosisAddress={gnosisAddress} daoAddress={daoAddress} />*/}
			{/*)}*/}
			{type === "createAuction" && (
				<CreateAuction
					gnosisAddress={gnosisAddress}
					gnosisVotingThreshold={gnosisVotingThreshold}
					title={title}
					description={description}
					afterSubmit={afterSubmit}
				/>
			)}
			{type === "cancelAuction" && (
				<CancelAuction
					gnosisAddress={gnosisAddress}
					gnosisVotingThreshold={gnosisVotingThreshold}
					title={title}
					description={description}
					afterSubmit={afterSubmit}
				/>
			)}
			{type === "changeRole" && (
				<ChangeRole
					gnosisVotingThreshold={gnosisVotingThreshold}
					gnosisAddress={gnosisAddress}
					title={title}
					description={description}
					afterSubmit={afterSubmit}
					ownersCount={ownersCount}
				/>
			)}
			{type === "generalEVM" && (
				<GeneralEVM
					gnosisVotingThreshold={gnosisVotingThreshold}
					gnosisAddress={gnosisAddress}
					title={title}
					description={description}
					afterSubmit={afterSubmit}
				/>
			)}
			{/*{type === "requestFunding" && (*/}
			{/*	<RequestFunding gnosisAddress={gnosisAddress} daoAddress={daoAddress!} />*/}
			{/*)}*/}
		</div>
	)
}

export default CreateDaoAdminProposal
