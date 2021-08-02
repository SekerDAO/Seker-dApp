import {ZoraAuction} from "../../../types/zoraAuction"
import firebase from "firebase"

const getDAOZoraAuctions = async (gnosisAddress: string): Promise<ZoraAuction[]> => {
	const snapshot = await firebase
		.firestore()
		.collection("zoraAuctions")
		.where("gnosisAddress", "==", gnosisAddress)
		.get()
	return snapshot.docs.map(doc => doc.data() as ZoraAuction)
}

export default getDAOZoraAuctions
