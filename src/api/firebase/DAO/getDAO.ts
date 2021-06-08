import firebase from "firebase"
import {DAO} from "../../../types/DAO"

const getDAO = async (id: string): Promise<DAO> => {
	const snapshot = await firebase.firestore().collection("DAOs").doc(id).get()
	if (!snapshot.exists) {
		throw new Error("DAO not found")
	}
	return {
		...(snapshot.data() as Omit<DAO, "id">),
		id
	}
}

export default getDAO
