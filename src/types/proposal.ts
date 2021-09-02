import {DAOMemberRole} from "./DAO"
import {SafeSignature} from "../api/ethers/functions/gnosisSafe/safeUtils"
import {Abi} from "./abi"

// TODO: split this into DAO and Gnosis modules
export type ProposalType =
	| "joinHouse"
	| "requestFunding"
	| "changeRole"
	| "createZoraAuction"
	| "approveZoraAuction"
	| "cancelZoraAuction"
	| "generalEVM"

export const ProposalsTypeNames = {
	joinHouse: "Join House",
	requestFunding: "Request Funding",
	changeRole: "Change Role / Kick",
	createZoraAuction: "Create Zora Auction",
	approveZoraAuction: "Approve Zora Auction",
	endZoraAuction: "End Zora Auction",
	cancelZoraAuction: "Cancel Zora Auction",
	generalEVM: "General EVM"
} as const

export type ProposalState =
	| "active"
	| "canceled"
	| "executed"
	| "passed"
	| "failed"
	| "queued"
	| "waiting"

// export type DAOProposalFirebaseData = Pick<
// 	DAOProposal,
// 	| "id"
// 	| "type"
// 	| "gnosisAddress"
// 	| "userAddress"
// 	| "title"
// 	| "description"
// 	| "module"
// 	| "amount"
// 	| "recipientAddress"
// 	| "newRole"
// 	| "newThreshold"
// 	| "signatures"
// 	| "signaturesStep2"
// 	| "nftId"
// 	| "nftAddress"
// 	| "duration"
// 	| "reservePrice"
// 	| "curatorAddress"
// 	| "curatorFeePercentage"
// 	| "auctionCurrencySymbol"
// 	| "auctionCurrencyAddress"
// 	| "auctionId"
// 	| "contractAddress"
// 	| "contractAbi"
// 	| "contractMethod"
// 	| "callArgs"
// > & {state?: ProposalState}

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
	// for Zora auction
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
}

export type Proposal = DAOProposal | GnosisProposal

export const isGnosisProposal = (proposal: Proposal): proposal is GnosisProposal =>
	proposal.module === "gnosis"
