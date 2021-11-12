import singleVotingCard from "../assets/icons/single-voting.svg"
import singleVotingSimpleMembershipCard from "../assets/icons/single-voting-simple-membership.svg"
import linearVotingCompoundBravoCard from "../assets/icons/linear-voting-compound-bravo.svg"
import linearVotingSimpleMembershipCard from "../assets/icons/linear-voting-simple-membership.svg"
import linearVotingMolochSimpleMembershipCard from "../assets/icons/linear-voting-moloch-simple-membership.svg"
import quadraticVotingSimpleMembershipCard from "../assets/icons/quadratic-voting-simple-membership.svg"
import {VotingStrategy} from "../types/DAO"

const VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER = `
Lorem ipsum dolor sit amet, 
consectetur adipiscing elit, 
sed do eiusmod tempor incididunt 
ut labore et dolore magna aliqua. 
Ut enim ad minim veniam, quis 
nostrud exercitation ullamco 
laboris nisi ut aliquip ex ea commodo consequat.
`

export const VOTING_STRATEGIES: {
	strategy: VotingStrategy
	title: string
	description: string
	cardImage: string
}[] = [
	{
		strategy: "singleVoting",
		title: "ERC-20 Single Voting",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: singleVotingCard
	},
	{
		strategy: "singleVotingSimpleMembership",
		title: "Single Voting + Simple Membership",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: singleVotingSimpleMembershipCard
	},
	{
		strategy: "linearVotingSimpleMembershipZodiacExitModule",
		title: "ERC-20 Linear Voting Simple Membership + Zodiac Exit Module",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: linearVotingCompoundBravoCard
	},
	{
		strategy: "linearVotingSimpleMembership",
		title: "ERC-20 Linear Voting + Simple Membership",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: linearVotingSimpleMembershipCard
	},
	{
		strategy: "molochLinearVoting",
		title: "ERC-20 Linear Voting (Moloch) Simple Membership + Zodiac Exit Module",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: linearVotingMolochSimpleMembershipCard
	},
	{
		strategy: "quadraticVotingSimpleMembership",
		title: "ERC-20 Quadratic Voting + Simple Membership",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: quadraticVotingSimpleMembershipCard
	}
]
