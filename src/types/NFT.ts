import firebase from "firebase"

type NFTMediaInfo = {
	dimensions: string
	mimeType: string
	size: number
	uri: string
}

export type NFT = {
	id: number
	address: string
	createdDate: string
	name: string
	thumbnail: string
	desc: string
	externalUrl?: string
	media: NFTMediaInfo
	attributes?: Record<string, string | number | boolean>
	owner: string
	creator: string
	ownerType: "user" | "dao"
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

export type NftSort = "dateAsc" | "dateDesc" | "nameAsc" | "nameDesc"

export type NFTQueryParams = {
	user?: string
	limit?: number
	after: NFTSnapshot | null
	sort: NftSort
}

export type NFTGalleryItemProps = Pick<NFT, "thumbnail" | "name"> & {
	id: string
	isVideo: boolean
}
