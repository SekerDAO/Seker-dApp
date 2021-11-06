import {FunctionComponent} from "react"
import Paper from "../../../UI/Paper"
import {SeeleVotingStrategy} from "../../../../types/seele"
import {ReactComponent as WarningIcon} from "../../../../assets/icons/warning.svg"
import linearVotingCompoundBravoCard from "../../../../assets/icons/linear-voting-compound-bravo.svg"
import linearVotingMolochSimpleMembershipCard from "../../../../assets/icons/linear-voting-moloch-simple-membership.svg"
import linearVotingSimpleMembershipCard from "../../../../assets/icons/linear-voting-simple-membership.svg"
import quadraticVotingSimpleMembershipCard from "../../../../assets/icons/quadratic-voting-simple-membership.svg"
import singleVotingSimpleMembershipCard from "../../../../assets/icons/single-voting-simple-membership.svg"
import singleVotingCard from "../../../../assets/icons/single-voting.svg"

const VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER = `
Lorem ipsum dolor sit amet, 
consectetur adipiscing elit, 
sed do eiusmod tempor incididunt 
ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis 
nostrud exercitation ullamco 
laboris nisi ut aliquip ex ea commodo consequat.
`

export const VOTING_STRATEGIES_CONTENT: {
	[K in SeeleVotingStrategy]: {
		title: string
		description: string
		cardImage: string
	}
} = {
	singleVoting: {
		title: "ERC-20 Single Voting",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: singleVotingCard
	},
	singleVotingSimpleMembership: {
		title: "Single Voting + Simple Membership",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: singleVotingSimpleMembershipCard
	},
	linearVotingCompoundBravo: {
		title: "ERC-20 Linear Voting Compound Bravo with OZ Voting Tokens",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: linearVotingCompoundBravoCard
	},
	linearVotingSimpleMembership: {
		title: "ERC-20 Linear Voting + Simple Membership",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: linearVotingSimpleMembershipCard
	},
	molochLinearVoting: {
		title: "ERC-20 Linear Voting (Moloch) Simple Membership + Zodiac Exit Module",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: linearVotingMolochSimpleMembershipCard
	},
	quadraticVotingSimpleMembership: {
		title: "ERC-20 Quadratic Voting + Simple Membership",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: quadraticVotingSimpleMembershipCard
	}
}

const VotingStrategyCard: FunctionComponent<{
	votingStrategy: SeeleVotingStrategy
	onClick: (votingStrategy: SeeleVotingStrategy) => void
	isActive?: boolean // Temp prop for not implemented voting strategies. Remove it later!
}> = ({votingStrategy, onClick, isActive = false}) => {
	const {title, description, cardImage} = VOTING_STRATEGIES_CONTENT[votingStrategy]
	return (
		<div
			className={`voting-strategy-card${!isActive ? " disabled" : ""}`}
			onClick={() => onClick(votingStrategy)}
		>
			<div className="voting-strategy-card__inner">
				<div className="voting-strategy-card__front">
					<img src={cardImage} alt={title} />
				</div>
				<Paper className="voting-strategy-card__back">
					{isActive ? (
						<p>{description}</p>
					) : (
						<div className="voting-strategy-card__warning-message">
							<WarningIcon width="22px" height="22px" />
							<span>This Voting Strategy is not supported yet</span>
						</div>
					)}
				</Paper>
			</div>
		</div>
	)
}

export default VotingStrategyCard
