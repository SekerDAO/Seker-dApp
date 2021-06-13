import {DAOMemberRole} from "./DAO"

export type DAOProposalType = "applyForCommission" | "joinHouse" | "requestFunding" | "changeRole"

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
}
