import React, {FunctionComponent, useContext, useState} from "react"
import Select from "../../Controls/Select"
import "./styles.scss"
import JoinHouse from "./JoinHouse"
import RequestFunding from "./RequestFunding"
import ChangeRole from "./ChangeRole"
import {AuthContext} from "../../../context/AuthContext"
import {DAOProposalsTypeNames, DAOProposalType} from "../../../types/proposal"
import CreateZoraAuction from "./CreateZoraAuction"
import ApproveZoraAuction from "./ApproveZoraAuction"
import EndZoraAuction from "./EndZoraAuction"
import CancelZoraAuction from "./CancelZoraAuction"

const CreateDAOProposal: FunctionComponent<{
	isMember: boolean
	isAdmin: boolean
	daoAddress?: string
	gnosisAddress: string
	gnosisVotingThreshold: number
}> = ({isMember, isAdmin, daoAddress, gnosisAddress, gnosisVotingThreshold}) => {
	const {connected} = useContext(AuthContext)
	const [type, setType] = useState<DAOProposalType>(isMember ? "requestFunding" : "joinHouse")

	if (!connected) return <div>TODO: Please connect wallet</div>
	if (!isMember && !daoAddress) return <div>TODO: You cannot create proposals for this DAO</div>

	return (
		<div className="create-dao-proposal">
			<h2>Create Proposal</h2>
			<Select
				value={type}
				options={[
					{name: DAOProposalsTypeNames.joinHouse, value: "joinHouse"},
					{name: DAOProposalsTypeNames.requestFunding, value: "requestFunding"},
					{name: DAOProposalsTypeNames.changeRole, value: "changeRole"},
					{name: DAOProposalsTypeNames.createZoraAuction, value: "createZoraAuction"},
					{name: DAOProposalsTypeNames.approveZoraAuction, value: "approveZoraAuction"},
					{name: DAOProposalsTypeNames.cancelZoraAuction, value: "cancelZoraAuction"},
					{name: DAOProposalsTypeNames.endZoraAuction, value: "endZoraAuction"}
				].slice(...(isAdmin ? [1] : isMember ? [1, 3] : [0, 1]))}
				onChange={e => {
					setType(e.target.value as DAOProposalType)
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
			{type === "approveZoraAuction" && <ApproveZoraAuction gnosisAddress={gnosisAddress} />}
			{type === "endZoraAuction" && <EndZoraAuction gnosisAddress={gnosisAddress} />}
			{type === "cancelZoraAuction" && <CancelZoraAuction gnosisAddress={gnosisAddress} />}
			{type === "changeRole" && (
				<ChangeRole
					gnosisVotingThreshold={gnosisVotingThreshold}
					gnosisAddress={gnosisAddress}
					daoAddress={daoAddress}
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
