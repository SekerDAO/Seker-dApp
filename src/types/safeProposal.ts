import {SafeSignature, SafeTransaction} from "../api/ethers/functions/gnosisSafe/safeUtils"
import {UsulDeployType} from "./DAO"
import {PrebuiltTx} from "./common"
import {StrategyProposal} from "./strategyProposal"

export type SafeProposalType =
	| "changeRole"
	| "createAuction"
	| "cancelAuction"
	| "endAuction"
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

export type SafeProposalState = "active" | "executed" | "outdated"

export type SafeProposal = {
	id?: number
	gnosisAddress: string
	title: string
	nonce: number
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
	auctionCurrencySymbol?: string
	auctionCurrencyAddress?: string
	// For general EVM
	transactions?: PrebuiltTx[]
	// for decentralize DAO
	usulAddress?: string
	multiTx?: SafeTransaction
	usulDeployType?: UsulDeployType
	sideNetSafeAddress?: string
	bridgeAddress?: string
}

export const isSafeProposal = (
	proposal: SafeProposal | StrategyProposal
): proposal is SafeProposal => (proposal as SafeProposal).nonce != null
