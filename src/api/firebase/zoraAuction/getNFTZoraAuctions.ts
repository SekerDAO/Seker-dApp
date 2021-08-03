import {ZoraAuctionFirebaseData} from "../../../types/zoraAuction"
import firebase from "firebase"

const getNFTZoraAuctions = async (
	nftId: number,
	nftAddress: string
): Promise<ZoraAuctionFirebaseData[]> => {
	const auctions = await firebase
		.firestore()
		.collection("zoraAuctions")
		.where("nftAddress", "==", nftAddress)
		.where("nftId", "==", nftId)
		.orderBy("creationDate")
		.get()
	return auctions.docs.map(doc => doc.data() as ZoraAuctionFirebaseData)
}

export default getNFTZoraAuctions
