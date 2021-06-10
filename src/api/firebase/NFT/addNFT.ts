import {NFT} from "../../../types/NFT"
import firebase from "firebase"

const addNFT = async (nft: NFT, account: string): Promise<void> => {
	await firebase
		.firestore()
		.collection("nfts")
		.doc(nft.address)
		.set({
			...nft,
			nftAdminUserUID: account
		})
}

export default addNFT
