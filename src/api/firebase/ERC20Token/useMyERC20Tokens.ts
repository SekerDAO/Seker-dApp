import {useContext, useEffect, useState} from "react"
import {AuthContext} from "../../../context/AuthContext"
import {ERC20Token} from "../../../types/ERC20Token"
import getMyERC20Tokens from "./getMyERC20Tokens"

const useMyERC20Tokens = (): {
	tokens: ERC20Token[]
	loading: boolean
	error: boolean
} => {
	const [tokens, setTokens] = useState<ERC20Token[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {account} = useContext(AuthContext)

	useEffect(() => {
		if (account) {
			setLoading(true)
			setError(false)
			getMyERC20Tokens(account)
				.then(res => {
					setTokens(res.docs.map(doc => doc.data()))
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
		tokens,
		loading,
		error
	}
}

export default useMyERC20Tokens
