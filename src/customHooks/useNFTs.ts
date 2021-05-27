import {useEffect, useState} from "react"
import {NFTSnapshot} from "../types/NFT"
import getNFTs, {NFTQueryParams} from "../api/firebase/getNFTs"

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

	useEffect(() => {
		setLoading(true)
		setError(false)
		getNFTs({category, user, limit, after})
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
