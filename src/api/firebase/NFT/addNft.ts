import firebase from "firebase"
import config from "../../../config"
import {NFT} from "../../../types/NFT"

const addNft = async (nft: Omit<NFT, "owner" | "ownerType">): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const res = await fetch(`${config.CLOUD_FUNCTIONS_URL}/addNft`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			nft
		})
	})
	if (res.status !== 200) {
		throw new Error("Failed to add NFT")
	}
}

export default addNft
