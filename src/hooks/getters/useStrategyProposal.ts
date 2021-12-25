import {useContext, useEffect, useState} from "react"
import {
	getProposalState,
	getProposalVotesSummary
} from "../../api/ethers/functions/Usul/usulProposal"
import {getStrategyGovTokenAddress} from "../../api/ethers/functions/Usul/voting/usulStrategies"
import {hasVoted} from "../../api/ethers/functions/Usul/voting/votingApi"
import getDAO from "../../api/firebase/DAO/getDAO"
import getStrategyProposal from "../../api/firebase/strategyProposal/getStrategyProposal"
import {AuthContext} from "../../context/AuthContext"
import ProviderContext from "../../context/ProviderContext"
import {StrategyProposal} from "../../types/strategyProposal"

const useStrategyProposal = (
	id: string
): {
	proposal: (StrategyProposal & {proposalId: string; usulAddress: string}) | null
	userHasVoted: boolean
	loading: boolean
	error: boolean
	refetch: () => Promise<void>
} => {
	const [proposal, setProposal] = useState<(StrategyProposal & {proposalId: string}) | null>(null)
	const [userHasVoted, setUserHasVoted] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {connected, account} = useContext(AuthContext)
	const {provider} = useContext(ProviderContext)

	const getData = async () => {
		try {
			setLoading(true)
			setError(false)
			const proposalData = await getStrategyProposal(id)
			if (!proposalData) {
				throw new Error("Proposal not found")
			}
			const dao = await getDAO(proposalData.gnosisAddress)
			if (!dao.usulAddress) {
				throw new Error("Unexpected strategy proposal on DAO without usul address")
			}
			const {state, deadline} = await getProposalState(dao.usulAddress, proposalData.id, provider)
			setProposal({
				...proposalData,
				state,
				deadline,
				govTokenAddress: await getStrategyGovTokenAddress(proposalData.strategyAddress, provider),
				proposalId: id,
				usulAddress: dao.usulAddress,
				votes: await getProposalVotesSummary(dao.usulAddress, proposalData.id, provider)
			})
			if (state === "active" && account) {
				const alreadyVoted = await hasVoted(
					proposalData.strategyAddress,
					proposalData.id,
					account,
					provider
				)
				setUserHasVoted(alreadyVoted)
			}
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}

	useEffect(() => {
		if (id) {
			getData()
		}
	}, [id, account, connected])

	return {
		proposal,
		userHasVoted,
		loading,
		error,
		refetch: getData
	}
}

export default useStrategyProposal
