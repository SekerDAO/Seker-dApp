import {DAOMemberRole} from "./DAO"

export type DAOProposalType = "applyForCommission" | "joinHouse" | "requestFunding" | "changeRole"

type DAOState = "active" | "canceled" | "executed" | "passed" | "failed" | "queued"

export type ProposalFirebaseData = Pick<
	Proposal,
	"id" | "type" | "daoAddress" | "userAddress" | "title" | "description" | "amount" | "recipientAddress" | "newRole"
>

export type ProposalEtherData = Pick<
	Proposal,
	"id" | "type" | "userAddress" | "state" | "amount" | "yesVotes" | "noVotes" | "deadline" | "gracePeriod"
>

export type Proposal = {
	id?: number
	type: DAOProposalType
	daoAddress: string
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
}

export const DAOProposalsTypeNames = {
	applyForCommission: "Apply for Commission",
	joinHouse: "Join House",
	requestFunding: "Request Funding",
	changeRole: "Change Role / Kick"
} as const
