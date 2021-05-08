import {useEffect, useState} from "react"
import {firestore} from "../firebase/utils.js"

const useNFT = (id) => {
	const [NFT, setNFT] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	
	const fetchNFT = async (_id) => {
		const snapshot = await firestore
			.collection('nfts')
			.doc(_id)
			.get()
		if (!snapshot.exists) {
			throw new Error("NFT not found")
		}
		return {
			...snapshot.data(),
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
