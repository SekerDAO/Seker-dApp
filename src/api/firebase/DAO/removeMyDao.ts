import firebase from "firebase"
import config from "../../../config"

const removeMyDao = async (gnosisAddress: string): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}

	const res = await fetch(`${config.CLOUD_FUNCTIONS_URL}/removeMyDao`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({dao: gnosisAddress})
	})
	if (res.status !== 200) {
		throw new Error("Failed to remove DAO")
	}
}

export default removeMyDao
