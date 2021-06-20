import {useContext, useEffect, useState} from "react"
import {AuthContext} from "../../context/AuthContext"
import {DAO} from "../../types/DAO"
import getMyDAOs from "../../api/firebase/DAO/getMyDAOs"

const useMyDAOs = (): {
	DAOs: DAO[]
	loading: boolean
	error: boolean
} => {
	const [DAOs, setDAOs] = useState<DAO[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {account} = useContext(AuthContext)

	useEffect(() => {
		if (account) {
			setLoading(true)
			setError(false)
			getMyDAOs(account)
				.then(res => {
					setDAOs(res)
					setLoading(false)
				})
				.catch(e => {
					console.error(e)
					setError(true)
					setLoading(false)
				})
		}
	}, [account])

	return {
		DAOs,
		loading,
		error
	}
}

export default useMyDAOs
