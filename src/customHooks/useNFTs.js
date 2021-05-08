import {useEffect, useState} from "react"
import {firestore} from "../firebase/utils.js"

const useNFTs = ({filters, limit = 8, after}) => {
	const [NFTs, setNFTs] = useState({totalCount: 0, data: []})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	
	const fetchNFTs = async (_filters, _limit, _after) => {
		let ref = firestore.collection('nfts').orderBy('createdDate')
		if (_filters) {
			ref = ref.where('nftCategory', '==', _filters)
		}
		const totalSnapshot = await ref.get()
		if (_after) {
			ref = ref.startAfter(_after)
		}
		const snapshot = await ref.limit(_limit).get()
		return {
			totalCount: totalSnapshot.size,
			data: snapshot.docs
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
