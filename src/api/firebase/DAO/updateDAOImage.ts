import firebase from "firebase"

const updateDAOImage = async (file: File, address: string, imageType: "profile" | "header"): Promise<void> => {
	const imageRef = firebase.storage().ref(`daos/${imageType}s/${address}`)
	const snapshot = await imageRef.put(file)
	const url = await snapshot.ref.getDownloadURL()
	await firebase
		.firestore()
		.collection("DAOs")
		.doc(address)
		.update({[`${imageType}Image`]: url.split("&")[0]})
}

export default updateDAOImage
