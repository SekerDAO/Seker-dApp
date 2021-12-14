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

export type StrategyProposalFirebaseData = {
	id: number
	gnosisAddress: string
	userAddress: string
	strategyAddress: string
	strategyType: VotingStrategyName
	transactions: PrebuiltTx[]
	title: string
	description?: string
}

export type StrategyProposal = StrategyProposalFirebaseData & {
	state: StrategyProposalState
	govTokenAddress: string | null
}
