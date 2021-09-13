import {NFT} from "../../../types/NFT"
import firebase from "firebase"

const addNFT = async (nft: Omit<NFT, "owner" | "ownerType">, account: string): Promise<void> => {
	await firebase
		.firestore()
		.collection("nfts")
		.add({
			...nft,
			owner: account.toLowerCase(),
			ownerType: "user"
		})
}

export default addNFT
