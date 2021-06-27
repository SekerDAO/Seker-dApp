import firebase from "firebase"

const updateDAOImage = async (file: File, address: string): Promise<void> => {
	const imageRef = firebase.storage().ref(`daos/${address}`)
	const snapshot = await imageRef.put(file)
	const url = await snapshot.ref.getDownloadURL()
	await firebase
		.firestore()
		.collection("DAOs")
		.doc(address)
		.update({image: url.split("&")[0]})
}

export default updateDAOImage
