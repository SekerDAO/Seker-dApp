import firebase from "firebase"
import {User, UserWithAccount} from "../../../types/user"

const getUser = async (account: string): Promise<UserWithAccount | null> => {
	const userByURLSnapshot = await firebase
		.firestore()
		.collection("users")
		.where("url", "==", account.toLowerCase())
		.get()
	if (!userByURLSnapshot.empty) {
		return {
			...(userByURLSnapshot.docs[0].data() as User),
			account: userByURLSnapshot.docs[0].id
		}
	}
	const snapshot = await firebase.firestore().collection("users").doc(account.toLowerCase()).get()
	if (!snapshot.exists) {
		return null
	}
	return {
		...(snapshot.data() as User),
		account: snapshot.id
	}
}

export default getUser
