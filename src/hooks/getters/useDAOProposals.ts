import {useEffect, useState} from "react"
import {SafeProposal} from "../../types/safeProposal"
import getSafeProposals from "../../api/firebase/safeProposal/getSafeProposals"

const useDAOProposals = (
	gnosisAddress: string
): {
	proposals: (SafeProposal & {proposalId: string})[]
	loading: boolean
	error: boolean
	refetch: () => void
} => {
	const [proposals, setProposals] = useState<(SafeProposal & {proposalId: string})[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const getData = async () => {
		setLoading(true)
		setError(false)
		try {
			const firebaseData = (await getSafeProposals(gnosisAddress)).docs.map(doc => ({
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
						} as SafeProposal & {proposalId: string})
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
