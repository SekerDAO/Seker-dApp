import firebase from "firebase"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const cancelZoraAuction = async (id: number): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const snapshot = await firebase.firestore().collection("zoraAuctions").where("id", "==", id).get()
	if (snapshot.empty) {
		throw new Error("Auction not found")
	}

	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/cancelZoraAuction`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({id})
	})
	if (res.status !== 200) {
		throw new Error("Failed to approve Zora Auction")
	}
}

export default cancelZoraAuction
