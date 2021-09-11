import {useEffect, useState} from "react"
import {DAOQueryParams, DAOSnapshot} from "../../types/DAO"
import getDAOs from "../../api/firebase/DAO/getDAOs"

const useDAOs = ({
	limit,
	after
}: DAOQueryParams): {
	DAOs: {
		totalCount: number
		data: {
			snapshot: DAOSnapshot
			membersCount: number
		}[]
	}
	loading: boolean
	error: boolean
} => {
	const [DAOs, setDAOs] = useState<{
		totalCount: number
		data: {
			snapshot: DAOSnapshot
			membersCount: number
		}[]
	}>({totalCount: 0, data: []})
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	useEffect(() => {
		setLoading(true)
		setError(false)
		getDAOs({limit, after})
			.then(res => {
				setDAOs(prevState => ({
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
	}, [after])
	useEffect(() => {
		setLoading(true)
		setError(false)
		getDAOs({limit, after})
			.then(res => {
				setDAOs({
					totalCount: res.totalCount,
					data: res.data
				})
				setLoading(false)
			})
			.catch(e => {
				console.error(e)
				setError(true)
				setLoading(false)
			})
	}, [limit])

	return {
		DAOs,
		loading,
		error
	}
}

export default useDAOs
