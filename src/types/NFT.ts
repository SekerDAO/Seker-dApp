import firebase from "firebase"

export type NFT = {
	id: string
	nftName: string
	nftThumbnail: string
	nftPrice: number
	nftDesc: string
}

export type NFTSnapshot = firebase.firestore.QueryDocumentSnapshot<Omit<NFT, "id">>
