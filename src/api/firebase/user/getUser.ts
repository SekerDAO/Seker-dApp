import {User} from "../../../types/user"
import firebase from "firebase"

const getUser = async (account: string): Promise<User> => {
	const snapshot = await firebase.firestore().collection("users").doc(account).get()
	if (!snapshot.exists) {
		throw new Error("User not found")
	}
	return snapshot.data() as User
}

export default getUser
