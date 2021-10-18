import firebase from "firebase"

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
	// Created after deploying Seele module
	seeleAddress?: string
}

type DAOEthersData = {
	gnosisVotingThreshold: number
	tokenSymbol: string
	balance: number
	fundedProjects: number
	owners: string[]
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
