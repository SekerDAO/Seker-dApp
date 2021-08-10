import {ProposalFirebaseData} from "../../../types/proposal"
import firebase from "firebase"

const getDAOProposals = async (
	address: string
): Promise<firebase.firestore.QuerySnapshot<ProposalFirebaseData>> =>
	firebase
		.firestore()
		.collection("proposals")
		.where("gnosisAddress", "==", address.toLowerCase())
		.get() as Promise<firebase.firestore.QuerySnapshot<ProposalFirebaseData>>

export default getDAOProposals
