import firebase from "firebase"

const checkUserUrl = async (url: string, address: string): Promise<boolean> => {
	const snapshot = await firebase.firestore().collection("users").where("url", "==", url).get()
	if (snapshot.empty) {
		return true
	}
	const docs = snapshot.docs
	return docs[0].id === address
}

export default checkUserUrl
