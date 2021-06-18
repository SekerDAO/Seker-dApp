import {useContext, useEffect, useState} from "react"
import {Proposal} from "../../types/proposal"
import getDAOProposals from "../../api/firebase/proposal/getDAOProposals"
import {getHouseERC20DAOProposal} from "../../api/ethers/functions/ERC20HouseDAO/getERC20HouseDAO"
import {Web3Provider} from "@ethersproject/providers"
import EthersContext from "../../context/EthersContext"
import getERC20Balance from "../../api/ethers/functions/ERC20Token/getERC20Balance"
import getDAO from "../../api/firebase/DAO/getDAO"

const useERC20HouseDAOProposals = (
	daoAddress: string
): {
	proposals: Proposal[]
	loading: boolean
	error: boolean
} => {
	const {provider} = useContext(EthersContext)
	const [proposals, setProposals] = useState<Proposal[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const getProposals = async (address: string, _provider: Web3Provider) => {
		setLoading(true)
		setError(false)
		try {
			const dao = await getDAO(address)
			const firebaseData = (await getDAOProposals(address)).docs.map(doc => doc.data())
			const ethersData = await Promise.all(
				firebaseData.map(async p => {
					if (p.type === "applyForCommission") {
						return {
							yesVotes: 0,
							noVotes: 0,
							state: "active" as const,
							deadline: new Date().toISOString(),
							gracePeriod: null,
							userAddress: address,
							type: "applyForCommission" as const
						}
					}
					if (p.type === "joinHouse") {
						const balance = await getERC20Balance(dao.tokenAddress, p.userAddress, _provider)
						const proposalData = await getHouseERC20DAOProposal(address, Number(p.id), _provider)
						return {
							...proposalData,
							balance
						}
					}
					return getHouseERC20DAOProposal(address, Number(p.id), _provider)
				})
			)
			setProposals(
				firebaseData.map((p, index) => ({
					...p,
					...ethersData[index],
					id: Number(p.id)
				}))
			)
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}

	useEffect(() => {
		if (daoAddress && provider) {
			getProposals(daoAddress, provider)
		}
	}, [daoAddress, provider])

	return {
		proposals,
		loading,
		error
	}
}

export default useERC20HouseDAOProposals
