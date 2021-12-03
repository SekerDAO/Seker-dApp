import {useContext, useEffect, useState} from "react"
import {getNonce} from "../../api/ethers/functions/gnosisSafe/safeUtils"
import getSafeProposals from "../../api/firebase/safeProposal/getSafeProposals"
import getStrategyProposals from "../../api/firebase/strategyProposal/getStrategyProposals"
import EthersContext from "../../context/EthersContext"
import {SafeProposal} from "../../types/safeProposal"
import {StrategyProposal} from "../../types/strategyProposal"

const useProposals = (
	gnosisAddress: string
): {
	proposals: ((SafeProposal | StrategyProposal) & {proposalId: string; proposalType: string})[]
	loading: boolean
	error: boolean
	refetch: () => void
} => {
	const [proposals, setProposals] = useState<
		((SafeProposal | StrategyProposal) & {proposalId: string; proposalType: string})[]
	>([])
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
						} as SafeProposal & {proposalId: string; proposalType: string})
				),
				...(strategyProposalsFirebaseData.map(p => ({
					...p,
					proposalType: "strategy"
				})) as (StrategyProposal & {proposalId: string; proposalType: string})[])
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
