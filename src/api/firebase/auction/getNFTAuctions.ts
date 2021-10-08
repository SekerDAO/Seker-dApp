import {AuctionFirebaseData} from "../../../types/auction"
import firebase from "firebase"

const getNFTAuctions = async (
	nftId: number,
	nftAddress: string
): Promise<AuctionFirebaseData[]> => {
	const auctions = await firebase
		.firestore()
		.collection("auctions")
		.where("nftAddress", "==", nftAddress.toLowerCase())
		.where("nftId", "==", nftId)
		.orderBy("creationDate")
		.get()
	return auctions.docs.map(doc => doc.data() as AuctionFirebaseData)
}

export default getNFTAuctions
