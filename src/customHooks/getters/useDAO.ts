import {useContext, useEffect, useState} from "react"
import {DAOEnhanced} from "../../types/DAO"
import getDAO from "../../api/firebase/DAO/getDAO"
import getERC20Symbol from "../../api/ethers/functions/ERC20Token/getERC20Symbol"
import EthersContext from "../../context/EthersContext"
import {JsonRpcProvider} from "@ethersproject/providers"
import {
	getERC20HouseDAOBalance,
	getERC20HouseDAOFundedProjects
} from "../../api/ethers/functions/ERC20DAO/getERC20DAO"
import getVotingThreshold from "../../api/ethers/functions/gnosisSafe/getVotingThreshold"

const useDAO = (
	gnosisAddress: string
): {
	dao: DAOEnhanced | null
	loading: boolean
	error: boolean
} => {
	const [dao, setDao] = useState<DAOEnhanced | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {provider} = useContext(EthersContext)

	const getInfo = async (_gnosisAddress: string, _provider: JsonRpcProvider) => {
		setLoading(true)
		setError(false)
		try {
			const _dao = await getDAO(_gnosisAddress)
			const gnosisVotingThreshold = await getVotingThreshold(_gnosisAddress, _provider)
			let tokenSymbol = ""
			let balance = 0
			let fundedProjects = 0
			if (_dao.tokenAddress && _dao.daoAddress) {
				;[tokenSymbol, balance, fundedProjects] = await Promise.all([
					getERC20Symbol(_dao.tokenAddress, _provider),
					getERC20HouseDAOBalance(_dao.daoAddress, _provider),
					getERC20HouseDAOFundedProjects(_dao.daoAddress, _provider)
				])
			}
			setDao({
				..._dao,
				tokenSymbol,
				balance,
				fundedProjects,
				gnosisVotingThreshold
			})
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}

	useEffect(() => {
		if (provider) {
			getInfo(gnosisAddress, provider)
		}
	}, [gnosisAddress, provider])

	return {
		dao,
		loading,
		error
	}
}

export default useDAO
