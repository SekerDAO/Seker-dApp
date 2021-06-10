import React, {FunctionComponent, useState} from "react"
import Select from "../../Controls/Select"
import ApplyForCommission from "./ApplyForCommission"
import "./styles.scss"
import JoinHouse from "./JoinHouse"
import RequestFunding from "./RequestFunding"
import ChangeRole from "./ChangeRole"

type DAOProposalType = "applyForCommission" | "joinHouse" | "requestFunding" | "changeRole"

const CreateDAOProposal: FunctionComponent<{
	isOwner: boolean
}> = ({isOwner}) => {
	const [type, setType] = useState<DAOProposalType>(isOwner ? "requestFunding" : "applyForCommission")

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
			{type === "applyForCommission" && <ApplyForCommission />}
			{type === "joinHouse" && <JoinHouse />}
			{type === "requestFunding" && <RequestFunding />}
			{type === "changeRole" && <ChangeRole />}
		</div>
	)
}

export default CreateDAOProposal
