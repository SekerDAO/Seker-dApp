import {useEffect, useState} from "react"
import {Proposal} from "../../types/proposal"
import getProposals from "../../api/firebase/proposal/getProposals"

const useDAOProposals = (
	gnosisAddress: string
): {
	proposals: (Proposal & {proposalId: string})[]
	loading: boolean
	error: boolean
	refetch: () => void
} => {
	const [proposals, setProposals] = useState<(Proposal & {proposalId: string})[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const getData = async () => {
		setLoading(true)
		setError(false)
		try {
			const firebaseData = (await getProposals(gnosisAddress)).docs.map(doc => ({
				...doc.data(),
				proposalId: doc.id
			}))
			// TODO
			// const ethersData = await Promise.all(
			// 	firebaseData.map(async p => {
			// 		if (p.type === "joinHouse") {
			// 			const balance = await getERC20Balance(dao.tokenAddress!, p.userAddress, provider)
			// 			const proposalData = await getHouseERC20DAOProposal(
			// 				dao.daoAddress!,
			// 				Number(p.id),
			// 				provider
			// 			)
			// 			return {
			// 				...proposalData,
			// 				balance
			// 			}
			// 		}
			// 		if (p.module === "DAO") {
			// 			return getHouseERC20DAOProposal(dao.daoAddress!, Number(p.id), provider)
			// 		} else {
			// 			return {}
			// 		}
			// 	})
			// )
			setProposals(
				firebaseData.map(
					p =>
						({
							...p,
							// ...ethersData[index],
							id: Number(p.id),
							state: p.state!
						} as Proposal & {proposalId: string})
				)
			)
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}

	useEffect(() => {
		getData()
	}, [gnosisAddress])

	return {
		proposals,
		loading,
		error,
		refetch: getData
	}
}

export default useDAOProposals
