import {User} from "../../../types/user"
import firebase from "firebase"

const editUser = async (
	user: Omit<User, "myDaos" | "myDomains">,
	account: string
): Promise<void> => {
	await firebase.firestore().collection("users").doc(account.toLowerCase()).update(user)
}

export default editUser
