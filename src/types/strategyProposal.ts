import {BigNumber} from "@ethersproject/bignumber"
import {VotingStrategyName} from "./DAO"
import {PrebuiltTx} from "./common"

export const strategyProposalStates: StrategyProposalState[] = [
	"active",
	"canceled",
	"timeLocked",
	"executed",
	"executing",
	"uninitialized"
]

export type StrategyProposalState =
	| "active"
	| "canceled"
	| "timeLocked"
	| "executed"
	| "executing"
	| "uninitialized"
	| "pending"
	| "failed"

export type StrategyProposalType = "generalEvm" | "deployUsul" | "addStrategies"

export const VOTE_CHOICES = ["no", "yes", "abstain"] as const

export type StrategyProposalVotesSummary = {
	yes: BigNumber
	no: BigNumber
	abstain: BigNumber
	quorum: BigNumber
}

export type StrategyProposalVote = {
	voter: string
	choice: typeof VOTE_CHOICES[number]
	weight: BigNumber
}

export type StrategyProposalFirebaseData = {
	id: number
	gnosisAddress: string
	usulAddress: string
	userAddress: string
	strategyAddress: string
	strategyType: VotingStrategyName
	transactions: PrebuiltTx[]
	title: string
	description?: string
	type: StrategyProposalType
	newUsulAddress?: string
	sideNetSafeAddress?: string
	bridgeAddress?: string
	sideChain?: boolean
}

type StrategyProposalEthersData = {
	state: StrategyProposalState
	govTokenAddress: string | null
	votes: StrategyProposalVotesSummary
	deadline?: number
}

export type StrategyProposal = StrategyProposalFirebaseData & StrategyProposalEthersData
