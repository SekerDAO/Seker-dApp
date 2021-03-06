import {useContext, useEffect, useState} from "react"
import {
	getProposalState,
	getProposalVotesSummary
} from "../../api/ethers/functions/Usul/usulProposal"
import {getStrategyGovTokenAddress} from "../../api/ethers/functions/Usul/voting/usulStrategies"
import {getStrategyMembers, hasVoted} from "../../api/ethers/functions/Usul/voting/votingApi"
import getDAO from "../../api/firebase/DAO/getDAO"
import getStrategyProposal from "../../api/firebase/strategyProposal/getStrategyProposal"
import {VOTING_STRATEGIES} from "../../constants/votingStrategies"
import {AuthContext} from "../../context/AuthContext"
import {ProviderContext} from "../../context/ProviderContext"
import {StrategyProposal} from "../../types/strategyProposal"

const useStrategyProposal = (
	id: string
): {
	proposal:
		| (StrategyProposal & {
				proposalId: string
				usulBridgeAddress?: string
				members: string[] | null
		  })
		| null
	userHasVoted: boolean
	loading: boolean
	error: boolean
	multiChain: boolean
	refetch: () => Promise<void>
} => {
	const [proposal, setProposal] = useState<
		| (StrategyProposal & {
				proposalId: string
				usulBridgeAddress?: string
				members: string[] | null
		  })
		| null
	>(null)
	const [userHasVoted, setUserHasVoted] = useState(false)
	const [multiChain, setMultiChain] = useState(false)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {connected, account} = useContext(AuthContext)
	const {provider, sideChainProvider} = useContext(ProviderContext)

	const getData = async () => {
		try {
			setLoading(true)
			setError(false)
			const proposalData = await getStrategyProposal(id)
			if (!proposalData) {
				throw new Error("Proposal not found")
			}
			const dao = await getDAO(proposalData.gnosisAddress)
			const usul = dao.usuls.find(
				u => u.usulAddress.toLowerCase() === proposalData.usulAddress.toLowerCase()
			)
			if (!usul) {
				throw new Error("Usul for strategy proposal not found on dao")
			}
			setMultiChain(usul.deployType === "usulMulti")
			const {state, deadline} = await getProposalState(
				proposalData.usulAddress,
				proposalData.id,
				usul.deployType === "usulMulti" ? sideChainProvider : provider
			)
			setProposal({
				...proposalData,
				state,
				deadline,
				govTokenAddress: VOTING_STRATEGIES.find(s => s.strategy === proposalData.strategyType)
					?.withToken
					? await getStrategyGovTokenAddress(
							proposalData.strategyAddress,
							usul.deployType === "usulMulti" ? sideChainProvider : provider
					  )
					: null,
				members: VOTING_STRATEGIES.find(s => s.strategy === proposalData.strategyType)?.withMembers
					? await getStrategyMembers(
							proposalData.strategyAddress,
							usul.deployType === "usulMulti" ? sideChainProvider : provider
					  )
					: null,
				proposalId: id,
				usulAddress: usul.usulAddress,
				usulBridgeAddress: usul.bridgeAddress,
				votes: await getProposalVotesSummary(
					usul.usulAddress,
					proposalData.id,
					usul.deployType === "usulMulti" ? sideChainProvider : provider
				)
			})
			if (state === "active" && account) {
				const alreadyVoted = await hasVoted(
					proposalData.strategyAddress,
					proposalData.id,
					account,
					usul.deployType === "usulMulti" ? sideChainProvider : provider
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
		multiChain,
		loading,
		error,
		refetch: getData
	}
}

export default useStrategyProposal
