import {ProposalFirebaseData} from "../../../types/proposal"
import firebase from "firebase"

const addProposal = async (proposal: ProposalFirebaseData): Promise<void> => {
	await firebase.firestore().collection("proposals").add(proposal)
}

export default addProposal
