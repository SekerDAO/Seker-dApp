import {useContext, useEffect, useState} from "react"
import {DAO} from "../../types/DAO"
import getDAO from "../../api/firebase/DAO/getDAO"
import getERC20Symbol from "../../api/ethers/functions/ERC20Token/getERC20Symbol"
import EthersContext from "../../context/EthersContext"

const useDAO = (
	address: string
): {
	DAO: DAO | null
	tokenSymbol: string | null
	loading: boolean
	error: boolean
} => {
	// eslint-disable-next-line no-shadow
	const [DAO, setDAO] = useState<DAO | null>(null)
	const [tokenSymbol, setTokenSymbol] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {provider} = useContext(EthersContext)

	useEffect(() => {
		if (provider) {
			setLoading(true)
			setError(false)
			getDAO(address)
				.then(_DAO => {
					getERC20Symbol(_DAO.tokenAddress, provider)
						.then(symbol => {
							setLoading(false)
							setTokenSymbol(symbol)
							setDAO(_DAO)
						})
						.catch(e => {
							console.error(e)
							setError(true)
							setLoading(false)
						})
				})
				.catch(e => {
					console.error(e)
					setError(true)
					setLoading(false)
				})
		}
	}, [address, provider])

	return {
		DAO,
		tokenSymbol,
		loading,
		error
	}
}

export default useDAO
