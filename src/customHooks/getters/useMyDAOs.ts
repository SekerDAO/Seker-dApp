import {useContext, useEffect, useState} from "react"
import {AuthContext} from "../../context/AuthContext"
import {DAO} from "../../types/DAO"
import getMyDAOs from "../../api/firebase/DAO/getMyDAOs"

const useMyDAOs = (): {
	DAOs: DAO[]
	loading: boolean
	error: boolean
	refetch: () => Promise<void>
} => {
	const [DAOs, setDAOs] = useState<DAO[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {account} = useContext(AuthContext)

	const getData = async () => {
		if (account) {
			setLoading(true)
			setError(false)
			try {
				const res = await getMyDAOs(account)
				setDAOs(res)
			} catch (e) {
				console.error(e)
				setError(true)
			}
			setLoading(false)
		}
	}

	useEffect(() => {
		getData()
	}, [account])

	return {
		DAOs,
		loading,
		error,
		refetch: getData
	}
}

export default useMyDAOs
