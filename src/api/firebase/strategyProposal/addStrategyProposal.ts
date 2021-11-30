import firebase from "firebase"
import {StrategyProposal} from "../../../types/strategyProposal"

const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const addStrategyProposal = async (
	proposal: Omit<StrategyProposal, "userAddress">
): Promise<void> => {
	const token = await firebase.auth().currentUser?.getIdToken(true)
	if (!token) {
		throw new Error("Not authorized in firebase")
	}
	const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/addStrategyProposal`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`
		},
		body: JSON.stringify(proposal)
	})
	if (res.status !== 200) {
		throw new Error("Failed to add strategy proposal")
	}
}

export default addStrategyProposal
