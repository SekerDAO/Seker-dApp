import {User, UserWithAccount} from "../../../types/user"
import firebase from "firebase"

const getUser = async (account: string): Promise<UserWithAccount> => {
	const userByURLSnapshot = await firebase.firestore().collection("users").where("url", "==", account).get()
	if (!userByURLSnapshot.empty) {
		return {
			...(userByURLSnapshot.docs[0].data() as User),
			account: userByURLSnapshot.docs[0].id
		}
	}
	const snapshot = await firebase.firestore().collection("users").doc(account).get()
	if (!snapshot.exists) {
		throw new Error("User not found")
	}
	return {
		...(snapshot.data() as User),
		account: snapshot.id
	}
}

export default getUser
