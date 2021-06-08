import firebase from "firebase"
import {DAOSnapshot} from "../../../types/DAO"

const getMyDAOs = async (account: string): Promise<DAOSnapshot[]> => {
	const snapshot = await firebase.firestore().collection("DAOs").where("owner", "==", account).get()
	return snapshot.docs as DAOSnapshot[]
}

export default getMyDAOs
