import React, {FunctionComponent, useContext, useState} from "react"
import Select from "../../Controls/Select"
import "./styles.scss"
import JoinHouse from "./JoinHouse"
import RequestFunding from "./RequestFunding"
import ChangeRole from "./ChangeRole"
import {AuthContext} from "../../../context/AuthContext"
import {DAOProposalsTypeNames, DAOProposalType} from "../../../types/proposal"

const CreateDAOProposal: FunctionComponent<{
	isMember: boolean
	daoAddress: string
}> = ({isMember, daoAddress}) => {
	const {connected} = useContext(AuthContext)
	const [type, setType] = useState<DAOProposalType>(isMember ? "requestFunding" : "joinHouse")

	if (!connected) return <div>TODO: Please connect wallet</div>

	return (
		<div className="create-dao-proposal">
			<h2>Create Proposal</h2>
			<Select
				value={type}
				options={[
					{name: DAOProposalsTypeNames.joinHouse, value: "joinHouse"},
					{name: DAOProposalsTypeNames.requestFunding, value: "requestFunding"},
					{name: DAOProposalsTypeNames.changeRole, value: "changeRole"}
				].slice(...(isMember ? [1] : [0, 1]))}
				onChange={e => {
					setType(e.target.value as DAOProposalType)
				}}
			/>
			{type === "joinHouse" && <JoinHouse daoAddress={daoAddress} />}
			{type === "requestFunding" && <RequestFunding daoAddress={daoAddress} />}
			{type === "changeRole" && <ChangeRole daoAddress={daoAddress} />}
		</div>
	)
}

export default CreateDAOProposal
