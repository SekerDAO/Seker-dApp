import firebase from "firebase"
import {StrategyProposal} from "../../../types/strategyProposal"

const getStrategyProposal = async (id: string): Promise<StrategyProposal | null> => {
	const snapshot = await firebase.firestore().collection("strategyProposals").doc(id).get()

	if (!snapshot.exists) {
		return null
	}

	return snapshot.data() as StrategyProposal
}

export default getStrategyProposal
