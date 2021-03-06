import firebase from "firebase"
import {SafeProposal} from "../../../types/safeProposal"

const getSafeProposal = async (id: string): Promise<SafeProposal | null> => {
	const snapshot = await firebase.firestore().collection("safeProposals").doc(id).get()

	if (!snapshot.exists) {
		return null
	}

	return snapshot.data() as SafeProposal
}

export default getSafeProposal
