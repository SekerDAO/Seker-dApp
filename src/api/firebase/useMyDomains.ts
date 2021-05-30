import {useContext, useEffect, useState} from "react"
import getMyDomains from "./getMyDomains"
import {AuthContext} from "../../context/AuthContext"
import {Domain} from "../../types/domain"

const useMyDomains = (): {
	domains: Domain[]
	loading: boolean
	error: boolean
} => {
	const [domains, setDomains] = useState<Domain[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {account} = useContext(AuthContext)

	useEffect(() => {
		if (account) {
			setLoading(true)
			setError(false)
			getMyDomains(account)
				.then(res => {
					setDomains(res.docs.map(doc => doc.data()))
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
		domains,
		loading,
		error
	}
}

export default useMyDomains
