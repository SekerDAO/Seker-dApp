import {useContext, useEffect, useState} from "react"
import {Proposal} from "../../types/proposal"
import getDAOProposals from "../../api/firebase/proposal/getDAOProposals"
import {getHouseERC20DAOProposal} from "../../api/ethers/functions/ERC20HouseDAO/getERC20HouseDAO"
import {Web3Provider} from "@ethersproject/providers"
import EthersContext from "../../context/EthersContext"

const useDAOProposals = (
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
			const firebaseData = (await getDAOProposals(address)).docs.map(doc => doc.data())
			const ethersData = await Promise.all(
				firebaseData.map(p =>
					p.type === "applyForCommission"
						? {
								yesVotes: 0,
								noVotes: 0,
								state: "active" as const,
								deadline: new Date().toISOString(),
								gracePeriod: null,
								userAddress: address,
								type: "applyForCommission" as const
						  }
						: getHouseERC20DAOProposal(address, Number(p.id), _provider)
				)
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

export default useDAOProposals
