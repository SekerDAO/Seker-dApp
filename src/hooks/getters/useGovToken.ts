import {useContext, useEffect, useState} from "react"
import getERC20Balance from "../../api/ethers/functions/ERC20Token/getERC20Balance"
import {getStrategyGovTokenAddress} from "../../api/ethers/functions/Usul/voting/usulStrategies"
import {checkDelegatee} from "../../api/ethers/functions/Usul/voting/votingApi"
import {AuthContext} from "../../context/AuthContext"
import ProviderContext from "../../context/ProviderContext"

const useGovToken = (
	strategyAddress: string
): {
	govTokenAddress: string | null
	delegateeAddress: string | null
	balance: number
	loading: boolean
	error: boolean
} => {
	const [govTokenAddress, setGovTokenAddress] = useState<string | null>(null)
	const [delegateeAddress, setDelegateeAddress] = useState<string | null>(null)
	const [balance, setBalance] = useState(0)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {provider} = useContext(ProviderContext)
	const {account} = useContext(AuthContext)

	const getGovTokenAddress = async () => {
		if (!strategyAddress) return
		setLoading(true)
		try {
			const tokenAddress = await getStrategyGovTokenAddress(strategyAddress, provider)
			setGovTokenAddress(tokenAddress)
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}
	useEffect(() => {
		if (strategyAddress) {
			getGovTokenAddress()
		}
	}, [strategyAddress])

	const getUserData = async () => {
		if (!(govTokenAddress && account)) return
		setLoading(true)
		try {
			const [delegatee, newBalance] = await Promise.all([
				checkDelegatee(govTokenAddress, account, provider),
				getERC20Balance(govTokenAddress, account, provider)
			])
			setDelegateeAddress(delegatee)
			setBalance(newBalance)
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}
	useEffect(() => {
		if (govTokenAddress && account) {
			getUserData()
		}
	}, [govTokenAddress, account])

	return {
		govTokenAddress,
		delegateeAddress,
		balance,
		loading,
		error
	}
}

export default useGovToken
