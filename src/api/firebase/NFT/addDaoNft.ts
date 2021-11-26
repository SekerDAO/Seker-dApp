import firebase from "firebase"
import {NFT} from "../../../types/NFT"

const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const addDaoNft = async (nft: Omit<NFT, "owner" | "ownerType">, address: string): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/addDaoNft`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			nft,
			address: address.toLowerCase()
		})
	})
	if (res.status !== 200) {
		throw new Error("Failed to add NFT")
	}
}

export default addDaoNft
