import {ZoraAuction} from "../../types/zoraAuction"
import {useEffect, useState} from "react"
import getDAOZoraAuctions from "../../api/firebase/zoraAuction/getDAOZoraAuctions"

const useDAOZoraAuctions = (
	gnosisAddress: string
): {
	auctions: ZoraAuction[]
	loading: boolean
	error: boolean
} => {
	const [auctions, setAuctions] = useState<ZoraAuction[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	useEffect(() => {
		if (gnosisAddress) {
			setLoading(true)
			setError(false)
			getDAOZoraAuctions(gnosisAddress)
				.then(res => {
					setAuctions(res)
					setLoading(false)
				})
				.catch(e => {
					console.error(e)
					setError(true)
					setLoading(false)
				})
		}
	}, [gnosisAddress])

	return {
		auctions,
		loading,
		error
	}
}

export default useDAOZoraAuctions
