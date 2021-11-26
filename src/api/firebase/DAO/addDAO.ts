import firebase from "firebase"

const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const addDAO = async (gnosisAddress: string): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const snapshot = await firebase
		.firestore()
		.collection("DAOs")
		.doc(gnosisAddress.toLowerCase())
		.get()
	if (snapshot.exists) {
		throw new Error("DAO already added")
	}

	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/addDao`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({gnosisAddress})
	})
	if (res.status !== 200) {
		throw new Error("Failed to add DAO")
	}
}

export default addDAO
