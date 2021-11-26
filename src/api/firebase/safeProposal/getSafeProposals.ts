import firebase from "firebase"
import {SafeProposal} from "../../../types/safeProposal"

const getSafeProposals = async (
	address: string
): Promise<firebase.firestore.QuerySnapshot<SafeProposal>> =>
	firebase
		.firestore()
		.collection("safeProposals")
		.where("gnosisAddress", "==", address.toLowerCase())
		.get() as Promise<firebase.firestore.QuerySnapshot<SafeProposal>>

export default getSafeProposals
