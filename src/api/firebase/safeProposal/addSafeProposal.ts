import {SafeProposal} from "../../../types/safeProposal"
import firebase from "firebase"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const addSafeProposal = async (proposal: Omit<SafeProposal, "userAddress">): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/addSafeProposal`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify({...proposal})
	})
	if (res.status !== 200) {
		throw new Error("Failed to add safe proposal")
	}
}

export default addSafeProposal
