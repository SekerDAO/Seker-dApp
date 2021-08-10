import firebase from "firebase"

const updateUserImage = async (
	file: File,
	account: string,
	imageType: "profile" | "header"
): Promise<void> => {
	const imageRef = firebase.storage().ref(`users/${imageType}s/${account}`)
	const snapshot = await imageRef.put(file)
	const url = await snapshot.ref.getDownloadURL()
	await firebase
		.firestore()
		.collection("users")
		.doc(account.toLowerCase())
		.update({[`${imageType}Image`]: url.split("&")[0]})
}

export default updateUserImage
