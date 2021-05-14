import {useEffect, useState} from "react"
import {NFTSnapshot} from "../types/NFT"
import firebase from "firebase/app"

const useNFTs = ({
	filters,
	limit = 8,
	after
}: {
	filters: string
	limit?: number
	after: NFTSnapshot | null
}): {
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

	const fetchNFTs = async (_filters: string, _limit: number, _after: NFTSnapshot | null) => {
		let ref = firebase.firestore().collection("nfts").orderBy("createdDate")
		if (_filters) {
			ref = ref.where("nftCategory", "==", _filters)
		}
		const totalSnapshot = await ref.get()
		if (_after) {
			ref = ref.startAfter(_after)
		}
		const snapshot = await ref.limit(_limit).get()
		return {
			totalCount: totalSnapshot.size,
			data: snapshot.docs as NFTSnapshot[]
		}
	}

	useEffect(() => {
		setLoading(true)
		setError(false)
		fetchNFTs(filters, limit, after)
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
	}, [filters, limit, after])

	return {
		NFTs,
		loading,
		error
	}
}

export default useNFTs
