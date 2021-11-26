import {DAOFirebaseData} from "../../../types/DAO"
import firebase from "firebase"

const getDAO = async (gnosisAddress: string): Promise<DAOFirebaseData> => {
	const snapshot = await firebase
		.firestore()
		.collection("DAOs")
		.doc(gnosisAddress.toLowerCase())
		.get()
	if (!snapshot.exists) {
		throw new Error("DAO not found")
	}
	return {
		...snapshot.data(),
		gnosisAddress: gnosisAddress.toLowerCase()
	} as DAOFirebaseData
}

export default getDAO
