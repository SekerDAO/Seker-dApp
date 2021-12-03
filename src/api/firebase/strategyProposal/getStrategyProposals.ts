import firebase from "firebase"
import {StrategyProposal} from "../../../types/strategyProposal"

const getStrategyProposals = async (
	address: string
): Promise<firebase.firestore.QuerySnapshot<StrategyProposal>> =>
	firebase
		.firestore()
		.collection("strategyProposals")
		.where("gnosisAddress", "==", address.toLowerCase())
		.get() as Promise<firebase.firestore.QuerySnapshot<StrategyProposal>>

export default getStrategyProposals
