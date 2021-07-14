import {DAO} from "../../../types/DAO"
import firebase from "firebase"

const addDAO = async (
	{
		gnosisAddress,
		name,
		type,
		members,
		gnosisVotingThreshold
	}: Omit<DAO, "estimated" | "members"> & {members: string[]},
	account: string
): Promise<void> => {
	await firebase.firestore().collection("DAOs").doc(gnosisAddress).set({
		name,
		type,
		gnosisVotingThreshold,
		estimated: new Date().toISOString(),
		owner: account
	})
	for (const member of members) {
		await firebase
			.firestore()
			.collection("daoUsers")
			.add({
				dao: gnosisAddress,
				address: member,
				memberSince: new Date().toISOString(),
				role: type === "gallery" ? "admin" : "head"
			})
	}
}

export default addDAO
