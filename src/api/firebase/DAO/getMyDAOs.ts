import firebase from "firebase"
import {DAO, FirebaseDAOUser} from "../../../types/DAO"

const getMyDAOs = async (account: string): Promise<DAO[]> => {
	const usersSnapshot = await firebase.firestore().collection("daoUsers").where("address", "==", account).get()
	const users = usersSnapshot.docs.map(u => u.data()) as FirebaseDAOUser[]
	const daoSnapshots = await Promise.all(users.map(u => firebase.firestore().collection("DAOs").doc(u.dao).get()))
	return Promise.all(
		daoSnapshots.map(async snapshot => {
			const daoMembers = await firebase.firestore().collection("daoUsers").where("dao", "==", snapshot.id).get()
			return {
				...snapshot.data(),
				address: snapshot.id,
				members: daoMembers.docs.map(d => d.data())
			}
		})
	) as Promise<DAO[]>
}

export default getMyDAOs
