import React, {FunctionComponent, useContext, useState} from "react"
import Select from "../../Controls/Select"
import ApplyForCommission from "./ApplyForCommission"
import "./styles.scss"
import JoinHouse from "./JoinHouse"
import RequestFunding from "./RequestFunding"
import ChangeRole from "./ChangeRole"
import {AuthContext} from "../../../context/AuthContext"
import {DAOProposalType} from "../../../types/proposal"

const CreateDAOProposal: FunctionComponent<{
	isOwner: boolean
	daoAddress: string
}> = ({isOwner, daoAddress}) => {
	const {connected} = useContext(AuthContext)
	const [type, setType] = useState<DAOProposalType>(isOwner ? "requestFunding" : "applyForCommission")

	if (!connected) return <div>TODO: Please connect wallet</div>

	return (
		<div className="create-dao-proposal">
			<h2>Create a New Proposal</h2>
			<Select
				value={type}
				options={[
					{name: "Apply For Commission", value: "applyForCommission"},
					{name: "Join House", value: "joinHouse"},
					{name: "Request Funding", value: "requestFunding"},
					{name: "Change Role / Kick", value: "changeRole"}
				].slice(...(isOwner ? [2] : [0, 2]))}
				onChange={e => {
					setType(e.target.value as DAOProposalType)
				}}
			/>
			{type === "applyForCommission" && <ApplyForCommission daoAddress={daoAddress} />}
			{type === "joinHouse" && <JoinHouse daoAddress={daoAddress} />}
			{type === "requestFunding" && <RequestFunding daoAddress={daoAddress} />}
			{type === "changeRole" && <ChangeRole daoAddress={daoAddress} />}
		</div>
	)
}

export default CreateDAOProposal
