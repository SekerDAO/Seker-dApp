import firebase from "firebase"

type NFTMediaInfo = {
	dimensions: string
	mimeType: string
	size: number
	uri: string
}

export type NFT = {
	createdDate: string
	id: string
	nftName: string
	nftThumbnail: string
	nftPrice?: number
	nftDesc: string
	externalUrl?: string
	media: NFTMediaInfo
	attributes?: Record<string, string | number | boolean>
	nftCategory: "art" | "exhibit"
}

export type NFTMetadata = {
	name: string
	description: string
	image: string
	external_url: string
	media: NFTMediaInfo
	attributes: Record<string, string | number | boolean>
}

export type NFTSnapshot = firebase.firestore.QueryDocumentSnapshot<Omit<NFT, "id">>
