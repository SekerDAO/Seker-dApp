import {DAOMemberRole} from "./DAO"
import {SafeSignature} from "../api/ethers/functions/gnosisSafe/safeUtils"

export type DAOProposalType =
	| "joinHouse"
	| "requestFunding"
	| "changeRole"
	| "createZoraAuction"
	| "approveZoraAuction"
	| "endZoraAuction"
	| "cancelZoraAuction"

type DAOState = "active" | "canceled" | "executed" | "passed" | "failed" | "queued" | "waiting"

export type ProposalFirebaseData = Pick<
	Proposal,
	| "id"
	| "type"
	| "gnosisAddress"
	| "userAddress"
	| "title"
	| "description"
	| "amount"
	| "recipientAddress"
	| "newRole"
	| "newThreshold"
	| "signatures"
	| "signaturesStep2"
	| "nftId"
	| "nftAddress"
	| "duration"
	| "reservePrice"
	| "curatorAddress"
	| "curatorFeePercentage"
	| "auctionCurrencySymbol"
	| "auctionCurrencyAddress"
>

export type ProposalEtherData = Pick<
	Proposal,
	| "id"
	| "type"
	| "userAddress"
	| "state"
	| "amount"
	| "yesVotes"
	| "noVotes"
	| "deadline"
	| "gracePeriod"
>

export type Proposal = {
	id?: number
	type: DAOProposalType
	gnosisAddress: string
	userAddress: string
	title: string
	description?: string
	amount?: number
	recipientAddress?: string // for request funding and change role
	newRole?: DAOMemberRole | "kick"
	state: DAOState
	deadline: string
	gracePeriod: string | null
	noVotes: number
	yesVotes: number
	balance?: number
	// for changeRole for gnosis safe module
	newThreshold?: number
	signatures?: SafeSignature[]
	signaturesStep2?: SafeSignature[]
	// for Zora auction
	nftId?: number
	nftAddress?: string
	duration?: number
	reservePrice?: number
	curatorAddress?: string
	curatorFeePercentage?: number
	auctionCurrencySymbol?: string
	auctionCurrencyAddress?: string
}

export const DAOProposalsTypeNames = {
	joinHouse: "Join House",
	requestFunding: "Request Funding",
	changeRole: "Change Role / Kick",
	createZoraAuction: "Create Zora Auction",
	approveZoraAuction: "Approve Zora Auction",
	endZoraAuction: "End Zora Auction",
	cancelZoraAuction: "Cancel Zora Auction"
} as const
