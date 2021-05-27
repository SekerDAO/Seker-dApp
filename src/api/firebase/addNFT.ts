import {NFT} from "../../types/NFT"
import firebase from "firebase"

const addNFT = async (nft: Omit<NFT, "id">, account: string): Promise<void> => {
	await firebase
		.firestore()
		.collection("nfts")
		.add({
			...nft,
			nftAdminUserUID: account.toUpperCase()
		})
}

export default addNFT
