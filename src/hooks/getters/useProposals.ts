import {useContext, useEffect, useState} from "react"
import {
	getProposalState,
	getProposalVotesSummary
} from "../../api/ethers/functions/Usul/usulProposal"
import {getStrategyGovTokenAddress} from "../../api/ethers/functions/Usul/voting/usulStrategies"
import {getNonce} from "../../api/ethers/functions/gnosisSafe/safeUtils"
import getDAO from "../../api/firebase/DAO/getDAO"
import getSafeProposals from "../../api/firebase/safeProposal/getSafeProposals"
import getStrategyProposals from "../../api/firebase/strategyProposal/getStrategyProposals"
import {VOTING_STRATEGIES} from "../../constants/votingStrategies"
import {ProviderContext} from "../../context/ProviderContext"
import {SafeProposal} from "../../types/safeProposal"
import {StrategyProposal} from "../../types/strategyProposal"

const useProposals = (
	gnosisAddress: string
): {
	proposals: ((SafeProposal | StrategyProposal) & {proposalId: string; sideChain?: boolean})[]
	loading: boolean
	error: boolean
	refetch: () => void
} => {
	const [proposals, setProposals] = useState<
		((SafeProposal | StrategyProposal) & {proposalId: string; sideChain?: boolean})[]
	>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {provider, sideChainProvider} = useContext(ProviderContext)

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
		return (
			await Promise.all(
				dao.usuls.map(async ({usulAddress, deployType}) => {
					const proposalsSnapshots = await getStrategyProposals(usulAddress)
					const firebaseData = proposalsSnapshots.docs.map(doc => ({
						...doc.data(),
						proposalId: doc.id
					}))

					return Promise.all(
						firebaseData.map(async p => {
							const {state, deadline} = await getProposalState(
								usulAddress,
								p.id,
								deployType === "usulMulti" ? sideChainProvider : provider
							)
							return {
								...p,
								usulAddress,
								state,
								deadline,
								govTokenAddress: VOTING_STRATEGIES.find(s => s.strategy === p.strategyType)
									?.withToken
									? await getStrategyGovTokenAddress(
											p.strategyAddress,
											deployType === "usulMulti" ? sideChainProvider : provider
									  )
									: null,
								votes: await getProposalVotesSummary(
									usulAddress,
									p.id,
									deployType === "usulMulti" ? sideChainProvider : provider
								),
								sideChain: deployType === "usulMulti"
							}
						})
					)
				})
			)
		).reduce((acc, cur) => [...acc, ...cur], [])
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
