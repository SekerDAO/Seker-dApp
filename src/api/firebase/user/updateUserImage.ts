import firebase from "firebase"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const updateUserImage = async (
	file: File,
	account: string,
	imageType: "profile" | "header"
): Promise<void> => {
	const imageRef = firebase.storage().ref(`users/${imageType}s/${account}`)
	const snapshot = await imageRef.put(file)
	const url = await snapshot.ref.getDownloadURL()
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/editUser`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({[`${imageType}Image`]: url.split("&")[0]})
	})
	if (res.status !== 200) {
		throw new Error(`Failed to edit user ${imageType} image`)
	}
}

export default updateUserImage
