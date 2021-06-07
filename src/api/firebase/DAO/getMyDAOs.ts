import firebase from "firebase"
import {DAO} from "../../../types/DAO"

const getMyDAOs = async (account: string): Promise<firebase.firestore.QuerySnapshot<DAO>> =>
	firebase.firestore().collection("DAOs").where("owner", "==", account).get() as Promise<
		firebase.firestore.QuerySnapshot<DAO>
	>

export default getMyDAOs
