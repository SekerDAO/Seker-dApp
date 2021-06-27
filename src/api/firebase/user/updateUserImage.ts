import firebase from "firebase"

const updateUserImage = async (file: File, account: string): Promise<void> => {
	const imageRef = firebase.storage().ref(`users/${account}`)
	const snapshot = await imageRef.put(file)
	const url = await snapshot.ref.getDownloadURL()
	await firebase
		.firestore()
		.collection("users")
		.doc(account)
		.update({image: url.split("&")[0]})
}

export default updateUserImage
