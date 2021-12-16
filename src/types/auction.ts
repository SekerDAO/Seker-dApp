export type AuctionFirebaseData = {
	id: number
	gnosisAddress: string
	nftName: string
	nftAddress: string
	nftId: number
	duration: number
	reservePrice: number
	curatorAddress: string
	curatorFeePercentage: number
	tokenSymbol: string
	tokenAddress: string
	creationDate: string
}

export type AuctionEthersData = {
	price: number
	state: "waitingForBids" | "live" | "ended" | "finalized"
	endTime?: number
}

export type Auction = AuctionEthersData & AuctionFirebaseData
