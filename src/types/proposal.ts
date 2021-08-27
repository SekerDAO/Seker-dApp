import {DAOMemberRole} from "./DAO"
import {SafeSignature} from "../api/ethers/functions/gnosisSafe/safeUtils"

export type DAOProposalType =
	| "joinHouse"
	| "requestFunding"
	| "changeRole"
	| "createZoraAuction"
	| "approveZoraAuction"
	| "cancelZoraAuction"
	| "generalEVM"

export type DAOProposalState =
	| "active"
	| "canceled"
	| "executed"
	| "passed"
	| "failed"
	| "queued"
	| "waiting"

export type ProposalFirebaseData = Pick<
	Proposal,
	| "id"
	| "type"
	| "gnosisAddress"
	| "userAddress"
	| "title"
	| "description"
	| "module"
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
	| "auctionId"
> & {state?: DAOProposalState}

export type ProposalEtherData = Pick<
	DAOProposal,
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

type ProposalBase = {
	id?: number
	type: DAOProposalType
	gnosisAddress: string
	userAddress: string
	title: string
	description?: string
	amount?: number
	recipientAddress?: string // for request funding and change role
	newRole?: DAOMemberRole | "kick"
	state: DAOProposalState
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
}

type DAOProposal = ProposalBase & {
	module: "DAO"
	deadline: string
	gracePeriod: string | null
	noVotes: number
	yesVotes: number
}

type GnosisProposal = ProposalBase & {
	module: "gnosis"
	abi?: string
}

export type Proposal = DAOProposal | GnosisProposal

export const DAOProposalsTypeNames = {
	joinHouse: "Join House",
	requestFunding: "Request Funding",
	changeRole: "Change Role / Kick",
	createZoraAuction: "Create Zora Auction",
	approveZoraAuction: "Approve Zora Auction",
	endZoraAuction: "End Zora Auction",
	cancelZoraAuction: "Cancel Zora Auction",
	generalEVM: "General EVM"
} as const
