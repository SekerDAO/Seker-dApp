export type ZoraAuction = {
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
	approved: boolean
	// TODO: add properties fetched from blockchain, e.g. bids
}
