import {useEffect, useState} from "react"
import {NFT} from "../types/NFT"
import firebase from "firebase"

const useNFT = (
	id: string
): {
	NFT: NFT | null
	loading: boolean
	error: boolean
} => {
	const [NFT, setNFT] = useState<NFT | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const fetchNFT = async (_id: string) => {
		const snapshot = await firebase.firestore().collection("nfts").doc(_id).get()
		if (!snapshot.exists) {
			throw new Error("NFT not found")
		}
		return {
			...(snapshot.data() as Omit<NFT, "id">),
			id: _id
		}
	}

	useEffect(() => {
		setLoading(true)
		setError(false)
		fetchNFT(id)
			.then(_NFT => {
				setLoading(false)
				setNFT(_NFT)
			})
			.catch(e => {
				console.error(e)
				setError(true)
				setLoading(false)
			})
	}, [id])

	return {
		NFT,
		loading,
		error
	}
}

export default useNFT
