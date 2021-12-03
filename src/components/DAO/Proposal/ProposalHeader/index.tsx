import {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import {isSafeProposal, SafeProposal} from "../../../../types/safeProposal"
import {StrategyProposal} from "../../../../types/strategyProposal"
import {capitalize, formatReadableAddress} from "../../../../utlls"
import Tag from "../../../UI/Tag"
import "./styles.scss"

const ProposalHeader: FunctionComponent<{
	proposal: SafeProposal | StrategyProposal
	id: string
	showLinks?: boolean
}> = ({proposal, id, children, showLinks}) => {
	const isAdminProposal = isSafeProposal(proposal)

	return (
		<div className="proposal__header">
			{children}
			<div className="proposal__header-title">
				<h1>{proposal.title}</h1>
				<span>{isAdminProposal ? "Admin Voting" : "Linear Voting"}</span>
			</div>
			<div className="proposal__header-subtitle">
				<Tag variant={proposal.state}>{capitalize(proposal.state)}</Tag>
				<span>ID [ {id} ]</span>
				{proposal.state === "active" && !isAdminProposal && (
					<>
						<span>•</span>
						<span>[ # ] Days, [ # ] Hours Left</span>
					</>
				)}
			</div>
			{showLinks && (
				<div className="proposal__header-links">
					<p>
						Proposed by:
						<Link to={`/profile/${proposal.userAddress}`}>
							{formatReadableAddress(proposal.userAddress)}
						</Link>
					</p>
					{!isAdminProposal && (
						<p>
							Voting Token:
							<Link to={`TODO`}>{formatReadableAddress(proposal.userAddress)}</Link>
						</p>
					)}
				</div>
			)}
		</div>
	)
}

export default ProposalHeader
