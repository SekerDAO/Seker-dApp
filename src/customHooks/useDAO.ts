import {useEffect, useState} from "react"
import {DAO} from "../types/DAO"
import getDAO from "../api/firebase/DAO/getDAO"

const useDAO = (
	id: string
): {
	DAO: DAO | null
	loading: boolean
	error: boolean
} => {
	// eslint-disable-next-line no-shadow
	const [DAO, setDAO] = useState<DAO | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	useEffect(() => {
		setLoading(true)
		setError(false)
		getDAO(id)
			.then(_DAO => {
				setLoading(false)
				setDAO(_DAO)
			})
			.catch(e => {
				console.error(e)
				setError(true)
				setLoading(false)
			})
	}, [id])

	return {
		DAO,
		loading,
		error
	}
}

export default useDAO
