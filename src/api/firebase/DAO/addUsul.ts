import firebase from "firebase"
import config from "../../../config"
import {UsulFirebaseData} from "../../../types/DAO"

const addUsul = async ({
	gnosisAddress,
	usul
}: {
	gnosisAddress: string
	usul: UsulFirebaseData
}): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const snapshot = await firebase
		.firestore()
		.collection("DAOs")
		.doc(gnosisAddress.toLowerCase())
		.get()
	if (!snapshot.exists) {
		throw new Error("DAO not found")
	}

	const res = await fetch(`${config.CLOUD_FUNCTIONS_URL}/addUsul`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({gnosisAddress, usul})
	})
	if (res.status !== 200) {
		throw new Error("Failed to edit DAO")
	}
}

export default addUsul
