import {DAOQueryParams, DAOSnapshot} from "../../../types/DAO"
import firebase from "firebase"

const defaultLimit = 6

const getDAOs = async (
	params: DAOQueryParams
): Promise<{
	data: {
		snapshot: DAOSnapshot
		membersCount: number
	}[]
	totalCount: number
}> => {
	let ref = firebase.firestore().collection("DAOs").orderBy("estimated")
	if (params.type) {
		ref = ref.where("type", "==", params.type)
	}
	const totalSnapshot = await ref.get()
	if (params.after) {
		ref = ref.startAfter(params.after)
	}
	if (params.limit !== 0) {
		ref = ref.limit(params.limit ?? defaultLimit)
	}
	const snapshot = await ref.get()
	const data = await Promise.all(
		snapshot.docs.map(async s => {
			const usersSnapshot = await firebase.firestore().collection("daoUsers").where("dao", "==", s.id).get()
			return {
				snapshot: s as DAOSnapshot,
				membersCount: usersSnapshot.size
			}
		})
	)
	return {
		totalCount: totalSnapshot.size,
		data
	}
}

export default getDAOs
