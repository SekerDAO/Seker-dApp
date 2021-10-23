import {SafeSignature} from "../api/ethers/functions/gnosisSafe/safeUtils"
import {Abi} from "./abi"

export type SafeProposalType =
	| "changeRole"
	| "createAuction"
	| "cancelAuction"
	| "generalEVM"
	| "decentralizeDAO"

export const SafeProposalsTypeNames = {
	changeRole: "Admin Membership",
	createAuction: "Create Auction",
	endAuction: "End Auction",
	cancelAuction: "Cancel Auction",
	generalEVM: "General EVM",
	decentralizeDAO: "Decentralize DAO"
} as const

// TODO: this list contains DAO proposals states, remove unused
export type SafeProposalState =
	| "active"
	| "canceled"
	| "executed"
	| "passed"
	| "failed"
	| "queued"
	| "waiting"

export type SafeProposal = {
	id?: number
	gnosisAddress: string
	title: string
	description?: string
	state: SafeProposalState
	type: SafeProposalType
	userAddress: string
	amount?: number
	recipientAddress?: string // for change role
	newRole?: "admin" | "kick"
	balance?: number
	// for changeRole for gnosis safe module
	newThreshold?: number
	signatures: SafeSignature[]
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
	seeleAddress?: string
}
