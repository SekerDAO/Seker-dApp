export type DAOMemberRole = "member" | "admin" | "contributor"

export type DAODecisionMakingSpeed = "slow" | "medium" | "fast"

export type DAOVotingThreshold = "low" | "medium" | "high"

export type DAO = {
	type: "gallery" | "house"
	houseType?: "token" | "admission"
	name: string
	symbol: string
	totalSupply: number
	members: {
		address: string
		role: DAOMemberRole
		memberSince: string
	}[]
	decisionMakingSpeed: DAODecisionMakingSpeed
	votingThreshold: DAOVotingThreshold
	roles: {
		member: boolean
		admin: boolean
		contributor: boolean
	}
	tax: number
}
