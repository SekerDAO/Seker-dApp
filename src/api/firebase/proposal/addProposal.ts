import {Proposal} from "../../../types/proposal"
import firebase from "firebase"

const addProposal = async (proposal: Proposal): Promise<void> => {
	await firebase.firestore().collection("proposals").add(proposal)
}

export default addProposal
