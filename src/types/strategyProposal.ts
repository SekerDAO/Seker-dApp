import {VotingStrategyName} from "./DAO"
import {Abi} from "./abi"

export const strategyProposalStates: StrategyProposalState[] = [
	"active",
	"canceled",
	"timeLocked",
	"executed",
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

export type StrategyProposalFirebaseData = {
	id: number
	gnosisAddress: string
	userAddress: string
	strategyAddress: string
	strategyType: VotingStrategyName
	contractAddress: string
	contractAbi: Abi
	contractMethod: string
	args: (string | string[])[] // TODO
	title: string
	description?: string
}

export type StrategyProposal = StrategyProposalFirebaseData & {
	state: StrategyProposalState
}
