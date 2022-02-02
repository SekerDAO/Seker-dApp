import firebase from "firebase"
import {StrategyProposalFirebaseData} from "../../../types/strategyProposal"

const getStrategyProposals = async (
	usulAddress: string
): Promise<firebase.firestore.QuerySnapshot<StrategyProposalFirebaseData>> =>
	firebase
		.firestore()
		.collection("strategyProposals")
		.where("usulAddress", "==", usulAddress.toLowerCase())
		.get() as Promise<firebase.firestore.QuerySnapshot<StrategyProposalFirebaseData>>

export default getStrategyProposals
