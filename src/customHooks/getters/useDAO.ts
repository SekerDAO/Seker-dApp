import {useContext, useEffect, useState} from "react"
import {DAOEnhanced} from "../../types/DAO"
import getDAO from "../../api/firebase/DAO/getDAO"
import getERC20Symbol from "../../api/ethers/functions/ERC20Token/getERC20Symbol"
import EthersContext from "../../context/EthersContext"
import {Web3Provider} from "@ethersproject/providers"
import {
	getERC20HouseDAOBalance,
	getERC20HouseDAOFundedProjects
} from "../../api/ethers/functions/ERC20HouseDAO/getERC20HouseDAO"

const useDAO = (
	address: string
): {
	dao: DAOEnhanced | null
	loading: boolean
	error: boolean
} => {
	const [dao, setDao] = useState<DAOEnhanced | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {provider} = useContext(EthersContext)

	const getInfo = async (_address: string, _provider: Web3Provider) => {
		setLoading(true)
		setError(false)
		try {
			const _dao = await getDAO(address)
			const [tokenSymbol, balance, fundedProjects] = await Promise.all([
				getERC20Symbol(_dao.tokenAddress, _provider),
				getERC20HouseDAOBalance(_address, _provider),
				getERC20HouseDAOFundedProjects(_address, _provider)
			])
			setDao({
				..._dao,
				tokenSymbol,
				balance,
				fundedProjects
			})
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}

	useEffect(() => {
		if (provider) {
			getInfo(address, provider)
		}
	}, [address, provider])

	return {
		dao,
		loading,
		error
	}
}

export default useDAO
