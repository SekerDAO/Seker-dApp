import {useContext, useEffect, useState} from "react"
import {getProposalVotesList} from "../../api/ethers/functions/Usul/voting/votingApi"
import {toastError} from "../../components/UI/Toast"
import ProviderContext from "../../context/ProviderContext"
import {StrategyProposal, StrategyProposalVote} from "../../types/strategyProposal"

const useProposalVotes = (
	proposal: (StrategyProposal & {bridgeAddress?: string}) | null
): {
	votes: StrategyProposalVote[]
	loading: boolean
} => {
	const [votes, setVotes] = useState<StrategyProposalVote[]>([])
	const [loading, setLoading] = useState(false)
	const {provider, sideChainProvider} = useContext(ProviderContext)

	const getData = async (_proposal: StrategyProposal & {bridgeAddress?: string}) => {
		setLoading(true)
		try {
			const res = await getProposalVotesList(
				_proposal.strategyAddress,
				_proposal.id,
				_proposal.bridgeAddress ? sideChainProvider : provider,
				!!_proposal.bridgeAddress
			)
			setVotes(res)
		} catch (e) {
			console.error(e)
			toastError("Failed to get votes list")
		}
		setLoading(false)
	}

	useEffect(() => {
		if (proposal) {
			getData(proposal)
		}
	}, [proposal])

	return {
		votes,
		loading
	}
}

export default useProposalVotes
