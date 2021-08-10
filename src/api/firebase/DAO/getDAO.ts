import firebase from "firebase"
import {DAO, Member} from "../../../types/DAO"

const getDAO = async (gnosisAddress: string): Promise<DAO> => {
	const snapshot = await firebase
		.firestore()
		.collection("DAOs")
		.doc(gnosisAddress.toLowerCase())
		.get()
	if (!snapshot.exists) {
		throw new Error("DAO not found")
	}
	const daoMembers = await firebase
		.firestore()
		.collection("daoUsers")
		.where("dao", "==", gnosisAddress.toLowerCase())
		.get()
	return {
		...snapshot.data(),
		gnosisAddress: gnosisAddress.toLowerCase(),
		members: daoMembers.docs.map(m => m.data() as Member)
	} as DAO
}

export default getDAO
