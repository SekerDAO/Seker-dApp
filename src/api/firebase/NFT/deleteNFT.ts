import firebase from "firebase"

const deleteNFT = async (id: string): Promise<void> => {
	await firebase.firestore().collection("nfts").doc(id).delete()
}

export default deleteNFT
