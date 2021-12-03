import {useContext, useEffect, useState} from "react"
import {getNonce} from "../../api/ethers/functions/gnosisSafe/safeUtils"
import getSafeProposals from "../../api/firebase/safeProposal/getSafeProposals"
import getStrategyProposals from "../../api/firebase/strategyProposal/getStrategyProposals"
import EthersContext from "../../context/EthersContext"
import {ExtendedProposal} from "../../types/proposal"

const useProposals = (
	gnosisAddress: string
): {
	proposals: ExtendedProposal[]
	loading: boolean
	error: boolean
	refetch: () => void
} => {
	const [proposals, setProposals] = useState<ExtendedProposal[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {provider} = useContext(EthersContext)

	const getData = async () => {
		setLoading(true)
		setError(false)
		try {
			const [safeProposalsSnapshots, strategyProposalsSnapshot, nonce] = await Promise.all([
				getSafeProposals(gnosisAddress),
				getStrategyProposals(gnosisAddress),
				getNonce(gnosisAddress, provider)
			])
			const safeProposalsFirebaseData = safeProposalsSnapshots.docs.map(doc => ({
				...doc.data(),
				proposalId: doc.id
			}))
			const strategyProposalsFirebaseData = strategyProposalsSnapshot.docs.map(doc => ({
				...doc.data(),
				proposalId: doc.id
			}))
			setProposals([
				...safeProposalsFirebaseData.map(
					p =>
						({
							...p,
							id: Number(p.id),
							state: p.state === "active" && p.nonce < nonce ? "outdated" : p.state,
							proposalType: "admin"
						} as ExtendedProposal)
				),
				...(strategyProposalsFirebaseData.map(p => ({
					...p,
					proposalType: "strategy"
				})) as ExtendedProposal[])
			])
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

export default useProposals
