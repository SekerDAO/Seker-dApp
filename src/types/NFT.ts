import firebase from "firebase"

type NFTMediaInfo = {
	dimensions: string
	mimeType: string
	size: number
	uri: string
}

export type NFT = {
	address: string
	createdDate: string
	name: string
	thumbnail: string
	price?: number
	desc: string
	externalUrl?: string
	media: NFTMediaInfo
	attributes?: Record<string, string | number | boolean>
	category: "art" | "exhibit"
}

export type NFTMetadata = {
	name: string
	description: string
	image: string
	external_url: string
	media: NFTMediaInfo
	attributes: Record<string, string | number | boolean>
}

export type NFTSnapshot = firebase.firestore.QueryDocumentSnapshot<NFT>
