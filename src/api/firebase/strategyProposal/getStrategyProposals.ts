import firebase from "firebase"
import {StrategyProposalFirebaseData} from "../../../types/strategyProposal"

const getStrategyProposals = async (
	address: string
): Promise<firebase.firestore.QuerySnapshot<StrategyProposalFirebaseData>> =>
	firebase
		.firestore()
		.collection("strategyProposals")
		.where("gnosisAddress", "==", address.toLowerCase())
		.get() as Promise<firebase.firestore.QuerySnapshot<StrategyProposalFirebaseData>>

export default getStrategyProposals
