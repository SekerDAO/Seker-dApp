import {ZoraAuctionFirebaseData} from "../../../types/zoraAuction"
import firebase from "firebase"

const getDAOZoraAuctions = async (gnosisAddress: string): Promise<ZoraAuctionFirebaseData[]> => {
	const snapshot = await firebase
		.firestore()
		.collection("zoraAuctions")
		.where("gnosisAddress", "==", gnosisAddress)
		.get()
	return snapshot.docs.map(doc => doc.data() as ZoraAuctionFirebaseData)
}

export default getDAOZoraAuctions
