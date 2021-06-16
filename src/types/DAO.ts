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

export type DAO = {
	address: string
	type: "gallery" | "house"
	houseTokenType?: HouseDAOTokenType
	tokenAddress: string
	name: string
	totalSupply: number
	members: Member[]
	decisionMakingSpeed: DAODecisionMakingSpeed
	votingThreshold: number
	tax?: number
	minProposalAmount: number
}

export type DAOSnapshot = firebase.firestore.QueryDocumentSnapshot<DAO>
