import {DAOMemberRole} from "./DAO"
import {SafeSignature} from "../api/ethers/functions/gnosisSafe/safeUtils"
import {Abi} from "./abi"

// TODO: split this into DAO and Gnosis modules
export type ProposalType =
	// | "joinHouse"
	// | "requestFunding"
	| "changeRole"
	| "createAuction"
	| "approveAuction"
	| "cancelAuction"
	| "generalEVM"
	| "decentralizeDAO"

export const ProposalsTypeNames = {
	// joinHouse: "Join House",
	// requestFunding: "Request Funding",
	changeRole: "Admin Membership",
	createAuction: "Create Auction",
	approveAuction: "Approve Auction",
	endAuction: "End Auction",
	cancelAuction: "Cancel Auction",
	generalEVM: "General EVM",
	decentralizeDAO: "Decentralize DAO"
} as const

export type ProposalState =
	| "active"
	| "canceled"
	| "executed"
	| "passed"
	| "failed"
	| "queued"
	| "waiting"

// TODO: review
type ProposalBase = {
	id?: number
	type: ProposalType
	gnosisAddress: string
	title: string
	description?: string
	state: ProposalState
}

export type DAOProposal = ProposalBase & {
	module: "DAO"
	// deadline: string
	// gracePeriod: string | null
	// noVotes: number
	// yesVotes: number
}

export type GnosisProposal = ProposalBase & {
	module: "gnosis"
	userAddress: string
	amount?: number
	recipientAddress?: string // for change role
	newRole?: DAOMemberRole | "kick"
	balance?: number
	// for changeRole for gnosis safe module
	newThreshold?: number
	signatures?: SafeSignature[]
	signaturesStep2?: SafeSignature[]
	// for auction
	auctionId?: number
	nftId?: number
	nftAddress?: string
	duration?: number
	reservePrice?: number
	curatorAddress?: string
	curatorFeePercentage?: number
	auctionCurrencySymbol?: string
	auctionCurrencyAddress?: string
	// For general EVM
	contractAddress?: string
	contractAbi?: Abi
	contractMethod?: string
	callArgs?: Record<string, string | boolean>
	// for decentralize DAO
	daoVotingThreshold?: number
	gracePeriod?: number
}

export type Proposal = DAOProposal | GnosisProposal

export const isGnosisProposal = (proposal: Proposal): proposal is GnosisProposal =>
	proposal.module === "gnosis"
