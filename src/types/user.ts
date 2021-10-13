export type Domain = {
	name: string
	symbol: string
	address: string
}

export type User = {
	name?: string
	url?: string
	bio?: string
	location?: string
	email?: string
	website?: string
	twitter?: string
	instagram?: string
	profileImage?: string
	headerImage?: string
	myDaos: string[]
	myDomains: Domain[]
}

export type UserWithAccount = User & {account: string}
