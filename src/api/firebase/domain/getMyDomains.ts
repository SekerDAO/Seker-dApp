import firebase from "firebase"
import {Domain} from "../../../types/domain"

const getMyDomains = async (account: string): Promise<firebase.firestore.QuerySnapshot<Domain>> =>
	firebase.firestore().collection("domains").where("owner", "==", account).get() as Promise<
		firebase.firestore.QuerySnapshot<Domain>
	>

export default getMyDomains
