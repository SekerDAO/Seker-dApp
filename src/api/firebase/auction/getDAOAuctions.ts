import {AuctionFirebaseData} from "../../../types/auction"
import firebase from "firebase"

const getDAOAuctions = async (gnosisAddress: string): Promise<AuctionFirebaseData[]> => {
	const snapshot = await firebase
		.firestore()
		.collection("auctions")
		.where("gnosisAddress", "==", gnosisAddress.toLowerCase())
		.get()
	return snapshot.docs.map(doc => doc.data() as AuctionFirebaseData)
}

export default getDAOAuctions
