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
	recipientAddress?: string
	newRole?: DAOMemberRole | "kick"
	state: DAOState
	deadline: string
	gracePeriod: string | null
	noVotes: number
	yesVotes: number
	balance?: number
	newThreshold?: number
	signatures?: SafeSignature[]
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
