import firebase from "firebase"
import {DAO} from "../../../types/DAO"

const getDAO = async (address: string): Promise<DAO> => {
	const snapshot = await firebase.firestore().collection("DAOs").doc(address).get()
	if (!snapshot.exists) {
		throw new Error("DAO not found")
	}
	return {
		...snapshot.data(),
		address
	} as DAO
}

export default getDAO
