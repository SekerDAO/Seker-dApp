import React, {FunctionComponent, useContext, useState} from "react"
import Select from "../../Controls/Select"
import "./styles.scss"
import ChangeRole from "./ChangeRole"
import {AuthContext} from "../../../context/AuthContext"
import {ProposalsTypeNames, ProposalType} from "../../../types/proposal"
import CreateAuction from "./CreateAuction"
import CancelAuction from "./CancelAuction"
import useDAOProposals from "../../../customHooks/getters/useDAOProposals"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import Loader from "../../Loader"
import GeneralEVM from "./GeneralEVM"
import Input from "../../Controls/Input"

const CreateDaoAdminProposal: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
}> = ({gnosisAddress, gnosisVotingThreshold}) => {
	const {connected} = useContext(AuthContext)
	const [type, setType] = useState<ProposalType>("changeRole")
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
			<Select
				value={type}
				options={[
					{name: ProposalsTypeNames.changeRole, value: "changeRole"},
					{name: ProposalsTypeNames.createAuction, value: "createAuction"},
					{name: ProposalsTypeNames.cancelAuction, value: "cancelAuction"},
					{name: ProposalsTypeNames.endAuction, value: "endAuction"},
					{name: ProposalsTypeNames.generalEVM, value: "generalEVM"}
				]}
				onChange={e => {
					setType(e.target.value as ProposalType)
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
			<div className="create-dao-proposal__separator" />
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
