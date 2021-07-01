import firebase from "firebase"

export type HouseDAORole = "member" | "head"

export type GalleryDAORole = "member" | "admin" | "contributor"

export type DAOMemberRole = HouseDAORole | GalleryDAORole

export type DAODecisionMakingSpeed = "slow" | "medium" | "fast"

export type HouseDAOTokenType = "ERC20" | "NFT"

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
	address: string
	type: DAOType
	houseTokenType?: HouseDAOTokenType
	tokenAddress: string
	name: string
	estimated: string
	totalSupply: number
	members: Member[]
	decisionMakingSpeed: DAODecisionMakingSpeed
	votingThreshold: number
	tax?: number
	minProposalAmount: number
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
	"address" | "name" | "type" | "houseTokenType" | "description" | "profileImage"
> & {
	membersCount: number
}
