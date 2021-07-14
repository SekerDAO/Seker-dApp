import React, {FunctionComponent} from "react"
import MembersIcon from "../../../icons/MembersIcon"
import HouseIcon from "../../../icons/HouseIcon"
import ShieldIcon from "../../../icons/ShieldIcon"
import {DAOEnhanced} from "../../../types/DAO"

const AboutDAO: FunctionComponent<{
	dao: DAOEnhanced
}> = ({dao}) => (
	<>
		<div className="dao__summary">
			<div className="dao__summary-item">
				<p>Active Members</p>
				<MembersIcon />
				<h2>{dao.members.length}</h2>
			</div>
			<div className="dao__summary-item">
				<p>House Bank</p>
				<HouseIcon />
				<h2>{dao.balance}</h2>
			</div>
			<div className="dao__summary-item">
				<p>Funded Projects</p>
				<ShieldIcon />
				<h2>{dao.fundedProjects}</h2>
			</div>
		</div>
		<h2>About {dao.name}</h2>
		<div className="dao__separator" />
		<p>{dao.description}</p>
		<h2>DAO Parameters</h2>
		<div className="dao__params">
			<div className="dao__param">
				<h2>{dao.tokenSymbol}</h2>
				<p>
					ERC-20
					<br />
					Token
				</p>
			</div>
			<div className="dao__param">
				<h2>{dao.minProposalAmount}</h2>
				<p>
					Minimum
					<br />
					Proposal Amount
				</p>
			</div>
			<div className="dao__param">
				<h2>{dao.decisionMakingSpeed}</h2>
				<p>
					Decision
					<br />
					Making Speed
				</p>
			</div>
			<div className="dao__param">
				<h2>{dao.daoVotingThreshold}</h2>
				<p>
					Voting
					<br />
					Threshold
				</p>
			</div>
		</div>
	</>
)

export default AboutDAO
