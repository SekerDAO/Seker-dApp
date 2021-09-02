import {Proposal} from "../../../types/proposal"
import firebase from "firebase"

const getProposals = async (address: string): Promise<firebase.firestore.QuerySnapshot<Proposal>> =>
	firebase
		.firestore()
		.collection("proposals")
		.where("gnosisAddress", "==", address.toLowerCase())
		.get() as Promise<firebase.firestore.QuerySnapshot<Proposal>>

export default getProposals
