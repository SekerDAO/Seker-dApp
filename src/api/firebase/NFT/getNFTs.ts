import firebase from "firebase"
import {NFTQueryParams, NFTSnapshot} from "../../../types/NFT"

const defaultLimit = 8

const getNFTs = async (
	params: NFTQueryParams
): Promise<{
	data: NFTSnapshot[]
	totalCount: number
}> => {
	let ref = firebase.firestore().collection("nfts").orderBy("createdDate")
	if (params.category) {
		ref = ref.where("nftCategory", "==", params.category)
	}
	if (params.user) {
		ref = ref.where("nftAdminUserUID", "==", params.user)
	}
	const totalSnapshot = await ref.get()
	if (params.after) {
		ref = ref.startAfter(params.after)
	}
	if (params.limit !== 0) {
		ref = ref.limit(params.limit ?? defaultLimit)
	}
	const snapshot = await ref.get()
	return {
		totalCount: totalSnapshot.size,
		data: snapshot.docs as NFTSnapshot[]
	}
}

export default getNFTs
