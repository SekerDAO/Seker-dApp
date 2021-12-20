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

export type StrategyVotes = {
	yes: BigNumber
	no: BigNumber
	abstain: BigNumber
	quorum: BigNumber
}

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

type StrategyProposalEthersData = {
	state: StrategyProposalState
	govTokenAddress: string | null
	usulAddress: string
	votes: StrategyVotes
}

export type StrategyProposal = StrategyProposalFirebaseData & StrategyProposalEthersData
