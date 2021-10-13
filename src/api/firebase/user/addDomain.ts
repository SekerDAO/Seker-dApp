import {Domain} from "../../../types/user"
import firebase from "firebase"
import getUser from "./getUser"

const addDomain = async (domain: Domain, account: string): Promise<void> => {
	const user = await getUser(account)
	if (!user) {
		throw new Error("Cannot add domain: user not found")
	}
	await firebase
		.firestore()
		.collection("users")
		.doc(account.toLowerCase())
		.update({
			myDomains: [...user.myDomains, domain]
		})
}

export default addDomain
