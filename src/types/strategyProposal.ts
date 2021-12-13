import {VotingStrategyName} from "./DAO"
import {AbiFunction} from "./abi"

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
	contractAddress: string
	contractAbi: AbiFunction[]
	contractMethod: string
	args: (string | string[])[] // TODO
	title: string
	description?: string
}

export type StrategyProposal = StrategyProposalFirebaseData & {
	state: StrategyProposalState
	govTokenAddress: string | null
}
