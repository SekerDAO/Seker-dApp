//TODO: this is mostly mock type
export type DAO = {
	type: "gallery" | "house"
	houseType?: "token" | "admission" | "private"
	name: string
	symbol: string
	totalSupply: number
	members: {
		address: string
		role: "member" | "head"
		memberSince: string
	}[]
	decisionMakingSpeed: "slow" | "medium" | "fast"
	votingThreshold: "low" | "medium" | "high"
	roles: {
		member: boolean
		admin: boolean
		contributor: boolean
	}
	tax: number
}
