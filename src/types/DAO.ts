import firebase from "firebase"

export type DAOMemberRole = "member" | "admin"

export type Member = {
	address: string
	role: DAOMemberRole
	memberSince?: string
}

export type FirebaseDAOUser = Member & {
	id: string
	dao: string
}

export type DAO = {
	// Main properties, required at the moment of gnosis-safe deployment
	gnosisAddress: string
	name: string
	estimated: string
	members: Member[]
	gnosisVotingThreshold: number
	// Properties set at the moment of DAO contract deployment
	daoAddress?: string
	daoVotingThreshold?: number
	votingAddress?: string
	tokenAddress?: string
	totalSupply?: number
	// Optional properties, only present in Firebase
	description?: string
	website?: string
	twitter?: string
	telegram?: string
	discord?: string
	profileImage?: string
	headerImage?: string
}

export type DAOEnhanced = DAO & {
	tokenSymbol: string
	balance: number
	fundedProjects: number
}

export type DAOSnapshot = firebase.firestore.QueryDocumentSnapshot<
	Omit<DAO, "members"> & {membersCount: number}
>

export type DAOQueryParams = {
	limit?: number
	after: DAOSnapshot | null
}

export type DAOListItemProps = Pick<
	DAO,
	"gnosisAddress" | "name" | "description" | "profileImage"
> & {
	membersCount: number
}
