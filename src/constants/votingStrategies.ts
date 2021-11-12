import singleVotingCard from "../assets/icons/single-voting.svg"
import singleVotingSimpleMembershipCard from "../assets/icons/single-voting-simple-membership.svg"
import linearVotingCard from "../assets/icons/linear-voting.svg"
import linearVotingSimpleMembershipCard from "../assets/icons/linear-voting-simple-membership.svg"
import linearVotingSimpleMembershipZodiacExitModuleCard from "../assets/icons/linear-voting-simple-membership-zodiac-exit.svg"
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
	active: boolean
}[] = [
	{
		strategy: "singleVotingSimpleMembership",
		title: "Single Voting + Simple Membership",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: singleVotingSimpleMembershipCard,
		active: false
	},
	{
		strategy: "singleVoting",
		title: "ERC-20 Single Voting",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: singleVotingCard,
		active: false
	},
	{
		strategy: "linearVoting",
		title: "ERC-20 Linear Voting",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: linearVotingCard,
		active: true
	},
	{
		strategy: "linearVotingSimpleMembership",
		title: "ERC-20 Linear Voting + Simple Membership",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: linearVotingSimpleMembershipCard,
		active: false
	},
	{
		strategy: "linearVotingSimpleMembershipZodiacExitModule",
		title: "ERC-20 Linear Voting Simple Membership + Zodiac Exit Module",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: linearVotingSimpleMembershipZodiacExitModuleCard,
		active: false
	},
	{
		strategy: "quadraticVotingSimpleMembership",
		title: "ERC-20 Quadratic Voting + Simple Membership",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		cardImage: quadraticVotingSimpleMembershipCard,
		active: false
	}
]
