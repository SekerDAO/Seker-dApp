import firebase from "firebase"
import {NFT} from "../../../types/NFT"

const getNFT = async (id: string): Promise<NFT> => {
	const snapshot = await firebase.firestore().collection("nfts").doc(id).get()
	if (!snapshot.exists) {
		throw new Error("NFT not found")
	}
	return {
		...(snapshot.data() as Omit<NFT, "id">),
		id: id
	}
}

export default getNFT
