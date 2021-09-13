import React, {FunctionComponent, useContext, useState} from "react"
import Select from "../../Controls/Select"
import "./styles.scss"
import JoinHouse from "./JoinHouse"
import RequestFunding from "./RequestFunding"
import ChangeRole from "./ChangeRole"
import {AuthContext} from "../../../context/AuthContext"
import {ProposalsTypeNames, ProposalType} from "../../../types/proposal"
import CreateZoraAuction from "./CreateZoraAuction"
import ApproveZoraAuction from "./ApproveZoraAuction"
import CancelZoraAuction from "./CancelZoraAuction"
import useDAOProposals from "../../../customHooks/getters/useDAOProposals"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import Loader from "../../Loader"
import GeneralEVM from "./GeneralEVM"

const CreateDAOProposal: FunctionComponent<{
	isMember: boolean
	isAdmin: boolean
	daoAddress?: string
	gnosisAddress: string
	gnosisVotingThreshold: number
}> = ({isMember, isAdmin, daoAddress, gnosisAddress, gnosisVotingThreshold}) => {
	const {connected} = useContext(AuthContext)
	const [type, setType] = useState<ProposalType>(isMember ? "requestFunding" : "joinHouse")
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
	if (!isMember && !daoAddress) return <div>TODO: You cannot create proposals for this DAO</div>

	return (
		<div className="create-dao-proposal">
			<h2>Create A New Proposal</h2>
			<Select
				value={type}
				options={[
					{name: ProposalsTypeNames.joinHouse, value: "joinHouse"},
					{name: ProposalsTypeNames.requestFunding, value: "requestFunding"},
					{name: ProposalsTypeNames.changeRole, value: "changeRole"},
					{name: ProposalsTypeNames.createZoraAuction, value: "createZoraAuction"},
					{name: ProposalsTypeNames.approveZoraAuction, value: "approveZoraAuction"},
					{name: ProposalsTypeNames.cancelZoraAuction, value: "cancelZoraAuction"},
					{name: ProposalsTypeNames.endZoraAuction, value: "endZoraAuction"},
					{name: ProposalsTypeNames.generalEVM, value: "generalEVM"}
				].slice(...(isAdmin ? [1] : isMember ? [1, 3] : [0, 1]))}
				onChange={e => {
					setType(e.target.value as ProposalType)
				}}
			/>
			{type === "joinHouse" && daoAddress && (
				<JoinHouse gnosisAddress={gnosisAddress} daoAddress={daoAddress} />
			)}
			{type === "createZoraAuction" && (
				<CreateZoraAuction
					gnosisAddress={gnosisAddress}
					isAdmin={isAdmin}
					gnosisVotingThreshold={gnosisVotingThreshold}
				/>
			)}
			{type === "approveZoraAuction" && (
				<ApproveZoraAuction
					gnosisAddress={gnosisAddress}
					isAdmin={isAdmin}
					gnosisVotingThreshold={gnosisVotingThreshold}
				/>
			)}
			{type === "cancelZoraAuction" && (
				<CancelZoraAuction
					gnosisAddress={gnosisAddress}
					isAdmin={isAdmin}
					gnosisVotingThreshold={gnosisVotingThreshold}
				/>
			)}
			{type === "changeRole" && (
				<ChangeRole
					gnosisVotingThreshold={gnosisVotingThreshold}
					gnosisAddress={gnosisAddress}
					daoAddress={daoAddress}
					isAdmin={isAdmin}
				/>
			)}
			{type === "generalEVM" && (
				<GeneralEVM
					gnosisVotingThreshold={gnosisVotingThreshold}
					gnosisAddress={gnosisAddress}
					isAdmin={isAdmin}
				/>
			)}
			{/* TODO: refactor API for this type of proposal and remove non-null assertions */}
			{type === "requestFunding" && (
				<RequestFunding gnosisAddress={gnosisAddress} daoAddress={daoAddress!} />
			)}
		</div>
	)
}

export default CreateDAOProposal
