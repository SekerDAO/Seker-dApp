import {NFTQueryParams, NFTSnapshot} from "../../../types/NFT"
import firebase from "firebase"

const defaultLimit = 8

const getNFTs = async (
	params: NFTQueryParams
): Promise<{
	data: NFTSnapshot[]
	totalCount: number
}> => {
	let ref = firebase
		.firestore()
		.collection("nfts")
		.orderBy(
			["nameAsc", "nameDesc"].includes(params.sort) ? "name" : "createdDate",
			["nameAsc", "dateAsc"].includes(params.sort) ? "asc" : "desc"
		)
	if (params.user) {
		ref = ref.where("owner", "==", params.user.toLowerCase())
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
