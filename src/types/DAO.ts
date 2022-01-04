import firebase from "firebase"
import {SafeTransaction} from "../api/ethers/functions/gnosisSafe/safeUtils"

export type DAOFirebaseData = {
	// Main properties, required at the moment of gnosis-safe deployment
	gnosisAddress: string
	name: string
	estimated: string
	// Optional properties, only present in Firebase
	description?: string
	website?: string
	twitter?: string
	telegram?: string
	discord?: string
	profileImage?: string
	headerImage?: string
	// Created after deploying Usul module
	usulAddress?: string
}

type DAOEthersData = {
	gnosisVotingThreshold: number
	owners: string[]
	strategies: VotingStrategy[]
}

export type DAO = DAOFirebaseData & DAOEthersData

export type DAOSnapshot = firebase.firestore.QueryDocumentSnapshot<
	Omit<DAOFirebaseData, "gnosisAddress">
>

export type DAOQueryParams = {
	limit?: number
	after: DAOSnapshot | null
}

export type DAOListItemProps = Pick<
	DAO,
	"gnosisAddress" | "name" | "description" | "profileImage" | "owners"
>

export type VotingStrategyName =
	| "singleVoting"
	| "singleVotingSimpleMembership"
	| "linearVoting"
	| "linearVotingSimpleMembership"
	| "linearVotingSimpleMembershipZodiacExitModule"
	| "quadraticVotingSimpleMembership"

export type BuiltVotingStrategy = {
	tx: SafeTransaction
	strategy: VotingStrategyName
	expectedAddress: string
}

export type VotingStrategy = {
	name: VotingStrategyName
	votingPeriod: number
	quorumThreshold: number
	address: string
	govTokenAddress: string | null
}
