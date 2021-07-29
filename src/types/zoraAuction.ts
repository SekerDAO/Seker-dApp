export type ZoraAuction = {
	gnosisAddress: string
	nftAddress: string
	nftId: number
	duration: number
	reservePrice: number
	curatorAddress: string
	curatorFeePercentage: number
	tokenSymbol: string
	tokenAddress: string
	creationDate: string
	// TODO: add properties fetched from blockchain, e.g. bids
}
