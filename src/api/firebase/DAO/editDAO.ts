import {DAO} from "../../../types/DAO"
import firebase from "firebase"

const editDAO = async ({
	address,
	name,
	description,
	website,
	twitter,
	telegram,
	discord
}: Pick<DAO, "address" | "name" | "description" | "website" | "twitter" | "telegram" | "discord">): Promise<void> => {
	const snapshot = await firebase.firestore().collection("DAOs").doc(address).get()
	if (!snapshot.exists) {
		throw new Error("DAO not found")
	}
	await firebase.firestore().collection("DAOs").doc(address).update({
		name,
		description,
		website,
		twitter,
		telegram,
		discord
	})
}

export default editDAO
