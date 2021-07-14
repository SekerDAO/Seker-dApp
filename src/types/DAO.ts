import firebase from "firebase"

export type HouseDAORole = "member" | "head"

export type GalleryDAORole = "member" | "admin" | "contributor"

export type DAOMemberRole = HouseDAORole | GalleryDAORole

export type DAODecisionMakingSpeed = "slow" | "medium" | "fast"

export type Member = {
	address: string
	role: DAOMemberRole
	memberSince?: string
}

export type FirebaseDAOUser = Member & {
	id: string
	dao: string
}

export type DAOType = "gallery" | "house"

export type DAO = {
	// Main properties, required at the moment of gnosis-safe deployment
	gnosisAddress: string
	type: DAOType
	name: string
	estimated: string
	members: Member[]
	gnosisVotingThreshold: number
	// Properties set at the moment of DAO contract deployment
	daoAddress?: string
	tokenAddress?: string
	totalSupply?: number
	decisionMakingSpeed?: DAODecisionMakingSpeed
	tax?: number
	minProposalAmount?: number
	daoVotingThreshold?: number
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
	type?: DAOType
	limit?: number
	after: DAOSnapshot | null
}

export type DAOListItemProps = Pick<
	DAO,
	"gnosisAddress" | "name" | "description" | "profileImage"
> & {
	membersCount: number
}
