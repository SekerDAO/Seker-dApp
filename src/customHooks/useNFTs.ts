import {useEffect, useState} from "react"
import {NFTSnapshot} from "../types/NFT"
import firebase from "firebase/app"

const defaultLimit = 8

type NFTQueryParams = {
	category?: string
	user?: string
	limit?: number
	after: NFTSnapshot | null
}

const useNFTs = ({
	category,
	user,
	limit,
	after
}: NFTQueryParams): {
	NFTs: {
		totalCount: number
		data: NFTSnapshot[]
	}
	loading: boolean
	error: boolean
} => {
	const [NFTs, setNFTs] = useState<{totalCount: number; data: NFTSnapshot[]}>({totalCount: 0, data: []})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const fetchNFTs = async (params: NFTQueryParams) => {
		let ref = firebase.firestore().collection("nfts").orderBy("createdDate")
		if (params.category) {
			ref = ref.where("nftCategory", "==", params.category)
		}
		if (params.user) {
			ref = ref.where("nftAdminUserUID", "==", params.user)
		}
		const totalSnapshot = await ref.get()
		if (params.after) {
			ref = ref.startAfter(params.after)
		}
		const snapshot = await ref.limit(params.limit ?? defaultLimit).get()
		return {
			totalCount: totalSnapshot.size,
			data: snapshot.docs as NFTSnapshot[]
		}
	}

	useEffect(() => {
		setLoading(true)
		setError(false)
		fetchNFTs({category, user, limit, after})
			.then(res => {
				setNFTs(prevState => ({
					totalCount: res.totalCount,
					data: [...prevState.data, ...res.data]
				}))
				setLoading(false)
			})
			.catch(e => {
				console.error(e)
				setError(true)
				setLoading(false)
			})
	}, [category, user, limit, after])

	return {
		NFTs,
		loading,
		error
	}
}

export default useNFTs
