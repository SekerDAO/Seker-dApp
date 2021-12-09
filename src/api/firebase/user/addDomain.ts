import firebase from "firebase"
import config from "../../../config"
import {Domain} from "../../../types/user"

const addDomain = async (domain: Domain): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}

	const res = await fetch(`${config.CLOUD_FUNCTIONS_URL}/addMyDomain`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({domain})
	})
	if (res.status !== 200) {
		throw new Error("Failed to add domain")
	}
}

export default addDomain
