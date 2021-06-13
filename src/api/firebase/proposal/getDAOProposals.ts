import {Proposal} from "../../../types/proposal"
import firebase from "firebase"

const getDAOProposals = async (address: string): Promise<firebase.firestore.QuerySnapshot<Proposal>> =>
	firebase.firestore().collection("proposals").where("daoAddress", "==", address).get() as Promise<
		firebase.firestore.QuerySnapshot<Proposal>
	>

export default getDAOProposals
