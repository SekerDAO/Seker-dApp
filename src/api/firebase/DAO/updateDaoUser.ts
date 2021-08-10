import firebase from "firebase"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const updateDAOUser = async (gnosisAddress: string, memberAddress: string): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}

	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/updateDaoUser`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			gnosisAddress: gnosisAddress.toLowerCase(),
			memberAddress: memberAddress.toLowerCase()
		})
	})
	if (res.status !== 200) {
		throw new Error("Failed to update DAO user")
	}
}

export default updateDAOUser
