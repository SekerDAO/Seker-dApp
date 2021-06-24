import {NFT} from "../../../types/NFT"
import firebase from "firebase"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const addDAONFT = async (nft: NFT, address: string): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firabase")
	}
	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/addDaoNft`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			nft,
			address
		})
	})
	if (res.status !== 200) {
		throw new Error("Failed to add NFT")
	}
}

export default addDAONFT