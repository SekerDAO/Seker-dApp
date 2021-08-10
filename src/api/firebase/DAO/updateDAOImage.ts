import firebase from "firebase"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const updateDAOImage = async (
	file: File,
	gnosisAddress: string,
	imageType: "profile" | "header"
): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const imageRef = firebase.storage().ref(`daos/${imageType}s/${gnosisAddress}`)
	const snapshot = await imageRef.put(file)
	const url = await snapshot.ref.getDownloadURL()

	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/editDao`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({
			gnosisAddress: gnosisAddress.toLowerCase(),
			[`${imageType}Image`]: url.split("&")[0]
		})
	})
	if (res.status !== 200) {
		throw new Error(`Failed to update DAO ${imageType} image`)
	}
}

export default updateDAOImage
