import {useContext, useEffect, useState} from "react"
import {getProposalState} from "../../api/ethers/functions/Usul/usulProposal"
import {getStrategyGovTokenAddress} from "../../api/ethers/functions/Usul/voting/usulStrategies"
import {getNonce} from "../../api/ethers/functions/gnosisSafe/safeUtils"
import getDAO from "../../api/firebase/DAO/getDAO"
import getSafeProposals from "../../api/firebase/safeProposal/getSafeProposals"
import getStrategyProposals from "../../api/firebase/strategyProposal/getStrategyProposals"
import EthersContext from "../../context/EthersContext"
import {SafeProposal} from "../../types/safeProposal"
import {StrategyProposal} from "../../types/strategyProposal"

const useProposals = (
	gnosisAddress: string
): {
	proposals: ((SafeProposal | StrategyProposal) & {proposalId: string})[]
	loading: boolean
	error: boolean
	refetch: () => void
} => {
	const [proposals, setProposals] = useState<
		((SafeProposal | StrategyProposal) & {proposalId: string})[]
	>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {provider} = useContext(EthersContext)

	const fetchSafeProposals = async () => {
		const [proposalsSnapshots, nonce] = await Promise.all([
			getSafeProposals(gnosisAddress),
			getNonce(gnosisAddress, provider)
		])
		const firebaseData = proposalsSnapshots.docs.map(doc => ({
			...doc.data(),
			proposalId: doc.id
		}))
		return firebaseData.map(p => ({
			...p,
			state: p.state === "active" && p.nonce < nonce ? "outdated" : p.state
		}))
	}

	const fetchStrategyProposals = async () => {
		const dao = await getDAO(gnosisAddress)
		const usulAddress = dao.usulAddress
		if (!usulAddress) return []
		const proposalsSnapshots = await getStrategyProposals(gnosisAddress)
		const firebaseData = proposalsSnapshots.docs.map(doc => ({
			...doc.data(),
			proposalId: doc.id
		}))
		return Promise.all(
			firebaseData.map(async p => ({
				...p,
				state: await getProposalState(usulAddress, p.id, provider),
				govTokenAddress: await getStrategyGovTokenAddress(p.strategyAddress, provider)
			}))
		)
	}

	const getData = async () => {
		setLoading(true)
		setError(false)
		try {
			const [safeProposals, strategyProposals] = await Promise.all([
				fetchSafeProposals(),
				fetchStrategyProposals()
			])
			setProposals([...safeProposals, ...strategyProposals])
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
