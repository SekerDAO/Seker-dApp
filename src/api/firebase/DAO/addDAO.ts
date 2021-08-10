import {DAO} from "../../../types/DAO"
import firebase from "firebase"

const addDAO = async (
	{
		gnosisAddress,
		name,
		type,
		members
	}: Omit<DAO, "estimated" | "members" | "gnosisVotingThreshold"> & {members: string[]},
	account: string
): Promise<void> => {
	await firebase.firestore().collection("DAOs").doc(gnosisAddress.toLowerCase()).set({
		name,
		type,
		estimated: new Date().toISOString(),
		owner: account
	})
	for (const member of members) {
		await firebase
			.firestore()
			.collection("daoUsers")
			.add({
				dao: gnosisAddress.toLowerCase(),
				address: member.toLowerCase(),
				memberSince: new Date().toISOString(),
				role: type === "gallery" ? "admin" : "head"
			})
	}
}

export default addDAO
