import firebase from "firebase"
import {DAO, Member} from "../../../types/DAO"

const getDAO = async (address: string): Promise<DAO & {owner: string}> => {
	const snapshot = await firebase.firestore().collection("DAOs").doc(address).get()
	if (!snapshot.exists) {
		throw new Error("DAO not found")
	}
	const daoMembers = await firebase.firestore().collection("daoUsers").where("dao", "==", address).get()
	return {
		...snapshot.data(),
		address,
		members: daoMembers.docs.map(m => m.data() as Member)
	} as DAO & {owner: string}
}

export default getDAO
