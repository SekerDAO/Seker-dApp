import {SafeProposal} from "../../../types/safeProposal"
import firebase from "firebase"

const getSafeProposals = async (
	address: string
): Promise<firebase.firestore.QuerySnapshot<SafeProposal>> =>
	firebase
		.firestore()
		.collection("safeProposals")
		.where("gnosisAddress", "==", address.toLowerCase())
		.get() as Promise<firebase.firestore.QuerySnapshot<SafeProposal>>

export default getSafeProposals
