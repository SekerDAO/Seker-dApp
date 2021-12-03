import firebase from "firebase"
import {StrategyProposalFirebaseData} from "../../../types/strategyProposal"

const getStrategyProposal = async (id: string): Promise<StrategyProposalFirebaseData | null> => {
	const snapshot = await firebase.firestore().collection("strategyProposals").doc(id).get()

	if (!snapshot.exists) {
		return null
	}

	return snapshot.data() as StrategyProposalFirebaseData
}

export default getStrategyProposal
