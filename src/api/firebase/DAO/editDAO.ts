import {DAOFirebaseData} from "../../../types/DAO"
import firebase from "firebase"

const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const editDAO = async (
	dao: Omit<DAOFirebaseData, "estimated" | "name"> & {
		name?: string
	}
): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const snapshot = await firebase
		.firestore()
		.collection("DAOs")
		.doc(dao.gnosisAddress.toLowerCase())
		.get()
	if (!snapshot.exists) {
		throw new Error("DAO not found")
	}

	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/editDao`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify(dao)
	})
	if (res.status !== 200) {
		throw new Error("Failed to edit DAO")
	}
}

export default editDAO
