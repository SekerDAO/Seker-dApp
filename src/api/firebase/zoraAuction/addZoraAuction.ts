import firebase from "firebase"
import {ZoraAuction} from "../../../types/zoraAuction"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const addZoraAuction = async (
	auction: Omit<ZoraAuction, "creationDate" | "approved">
): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const snapshot = await firebase.firestore().collection("DAOs").doc(auction.gnosisAddress).get()
	if (!snapshot.exists) {
		throw new Error("DAO not found")
	}

	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/addZoraAuction`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify(auction)
	})
	if (res.status !== 200) {
		throw new Error("Failed to add Zora Auction")
	}
}

export default addZoraAuction
