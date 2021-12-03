import {VotingStrategyName} from "./DAO"
import {Abi} from "./abi"

export type StrategyProposalState = "active" // TODO

export type StrategyProposal = {
	id?: string
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
	state: StrategyProposalState
	type?: string
}
