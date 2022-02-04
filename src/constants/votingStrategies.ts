import linearVotingCardMini from "../assets/icons/Mini_ERC20LinearVoting.svg"
import linearVotingSimpleMembershipCardMini from "../assets/icons/Mini_ERC20LinearVotingSimpleMembership.svg"
import linearVotingSimpleMembershipZodiacExitModuleCardMini from "../assets/icons/Mini_ERC20LinearVotingSimpleMembershipExit.svg"
import quadraticVotingSimpleMembershipCardMini from "../assets/icons/Mini_ERC20QuadraticVotingSimpleMembership.svg"
import singleVotingCardMini from "../assets/icons/Mini_ERC20SingleVoting.svg"
import singleVotingSimpleMembershipCardMini from "../assets/icons/Mini_SingleVotingSimpleMembership.svg"
import linearVotingSimpleMembershipZodiacExitModuleCard from "../assets/icons/linear-voting-simple-membership-zodiac-exit.svg"
import linearVotingSimpleMembershipCard from "../assets/icons/linear-voting-simple-membership.svg"
import linearVotingCard from "../assets/icons/linear-voting.svg"
import quadraticVotingSimpleMembershipCard from "../assets/icons/quadratic-voting-simple-membership.svg"
import singleVotingSimpleMembershipCard from "../assets/icons/single-voting-simple-membership.svg"
import singleVotingCard from "../assets/icons/single-voting.svg"
import {VotingStrategyName} from "../types/DAO"

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
	strategy: VotingStrategyName
	title: string
	titleMini: string
	description: string
	descriptionMini: string
	cardImage: string
	cardImageMini: string
	active: boolean
}[] = [
	{
		strategy: "singleVotingSimpleMembership",
		title: "Single Voting + Simple Membership",
		titleMini: "Single Voting",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		descriptionMini: "Simple Membership",
		cardImage: singleVotingSimpleMembershipCard,
		cardImageMini: singleVotingSimpleMembershipCardMini,
		active: false
	},
	{
		strategy: "singleVoting",
		title: "ERC-20 Single Voting",
		titleMini: "Single Voting",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		descriptionMini: "No Membership",
		cardImage: singleVotingCard,
		cardImageMini: singleVotingCardMini,
		active: false
	},
	{
		strategy: "linearVoting",
		title: "ERC-20 Linear Voting",
		titleMini: "Linear Voting",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		descriptionMini: "No Membership",
		cardImage: linearVotingCard,
		cardImageMini: linearVotingCardMini,
		active: true
	},
	{
		strategy: "linearVotingSimpleMembership",
		title: "ERC-20 Linear Voting + Simple Membership",
		titleMini: "Linear Voting",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		descriptionMini: "Simple Membership",
		cardImage: linearVotingSimpleMembershipCard,
		cardImageMini: linearVotingSimpleMembershipCardMini,
		active: false
	},
	{
		strategy: "linearVotingSimpleMembershipZodiacExitModule",
		title: "ERC-20 Linear Voting Simple Membership + Zodiac Exit Module",
		titleMini: "Linear Voting",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		descriptionMini: "Simple Membership + Zodiac Exit",
		cardImage: linearVotingSimpleMembershipZodiacExitModuleCard,
		cardImageMini: linearVotingSimpleMembershipZodiacExitModuleCardMini,
		active: false
	},
	{
		strategy: "quadraticVotingSimpleMembership",
		title: "ERC-20 Quadratic Voting + Simple Membership",
		titleMini: "Quadratic Voting",
		description: VOTING_STRATEGY_DESCRIPTION_PLACEHOLDER,
		descriptionMini: "Simple Membership",
		cardImage: quadraticVotingSimpleMembershipCard,
		cardImageMini: quadraticVotingSimpleMembershipCardMini,
		active: false
	}
]
