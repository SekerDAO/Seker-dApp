import {useEffect, useState} from "react"
import {NFT} from "../types/NFT"
import getNFT from "../api/firebase/NFT/getNFT"

const useNFT = (
	id: string
): {
	NFT: NFT | null
	loading: boolean
	error: boolean
} => {
	// eslint-disable-next-line no-shadow
	const [NFT, setNFT] = useState<NFT | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	useEffect(() => {
		setLoading(true)
		setError(false)
		getNFT(id)
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
