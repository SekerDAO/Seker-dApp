import {NFT} from "../../../types/NFT"
import firebase from "firebase"

const getNFT = async (id: string): Promise<NFT> => {
	const snapshot = await firebase.firestore().collection("nfts").doc(id).get()
	if (!snapshot.exists) {
		throw new Error("NFT not found")
	}
	return snapshot.data() as NFT
}

export default getNFT
