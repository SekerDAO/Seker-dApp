import {JsonRpcProvider} from "@ethersproject/providers"
import firebase from "firebase"
import {DAOQueryParams, DAOSnapshot} from "../../../types/DAO"
import getOwners from "../../ethers/functions/gnosisSafe/getOwners"

const defaultLimit = 6

const getDAOs = async (
	params: DAOQueryParams,
	provider: JsonRpcProvider
): Promise<{
	data: {
		snapshot: DAOSnapshot
		owners: string[]
	}[]
	totalCount: number
}> => {
	let ref = firebase.firestore().collection("DAOs").orderBy("estimated")
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
			const owners = await getOwners(s.id, provider)
			return {
				snapshot: s as DAOSnapshot,
				owners
			}
		})
	)
	return {
		totalCount: totalSnapshot.size,
		data
	}
}

export default getDAOs
