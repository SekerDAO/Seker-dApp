import {useContext, useEffect, useState} from "react"
import getOwners from "../../api/ethers/functions/gnosisSafe/getOwners"
import getVotingThreshold from "../../api/ethers/functions/gnosisSafe/getVotingThreshold"
import {getNonce} from "../../api/ethers/functions/gnosisSafe/safeUtils"
import getDAO from "../../api/firebase/DAO/getDAO"
import getSafeProposal from "../../api/firebase/safeProposal/getSafeProposal"
import getStrategyProposal from "../../api/firebase/strategyProposal/getStrategyProposal"
import {AuthContext} from "../../context/AuthContext"
import EthersContext from "../../context/EthersContext"
import {ExtendedProposal} from "../../types/proposal"
import {SafeProposalState} from "../../types/safeProposal"

const useProposal = (
	id: string
): {
	proposal: ExtendedProposal | null
	gnosisVotingThreshold: number | null
	loading: boolean
	error: boolean
	canSign: boolean
} => {
	const [proposal, setProposal] = useState<ExtendedProposal | null>(null)
	const [gnosisVotingThreshold, setGnosisVotingThreshold] = useState<number | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const [canSign, setCanSign] = useState(false)
	const {connected, account} = useContext(AuthContext)
	const {provider} = useContext(EthersContext)

	const getData = async () => {
		try {
			setLoading(true)
			setError(false)
			let _proposal
			// TODO: Refactor to get proposal from single function
			_proposal = await getStrategyProposal(id)
			if (!_proposal) {
				_proposal = await getSafeProposal(id)
				if (!_proposal) {
					throw new Error("Proposal not found")
				}
				let trueState: SafeProposalState = _proposal.state
				if (trueState === "active") {
					const nonce = await getNonce(_proposal.gnosisAddress, provider)
					if (_proposal.nonce < nonce) {
						trueState = "outdated"
					}
				}
				const [votingThreshold, , owners] = await Promise.all([
					getVotingThreshold(_proposal.gnosisAddress, provider),
					getDAO(_proposal.gnosisAddress),
					getOwners(_proposal.gnosisAddress, provider)
				])
				setProposal({..._proposal, proposalType: "admin", state: trueState})
				setGnosisVotingThreshold(votingThreshold)
				setCanSign(
					!!(
						account &&
						connected &&
						owners.includes(account) &&
						trueState === "active" &&
						!_proposal.signatures?.find(s => s.signer.toLowerCase() === account)
					)
				)
			} else {
				const [votingThreshold] = await Promise.all([
					getVotingThreshold(_proposal.gnosisAddress, provider)
				])
				setProposal({..._proposal, proposalType: "strategy"})
				setGnosisVotingThreshold(votingThreshold)
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
		gnosisVotingThreshold,
		loading,
		error,
		canSign
	}
}

export default useProposal
