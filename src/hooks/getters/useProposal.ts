import {useContext, useEffect, useState} from "react"
import {AuthContext} from "../../context/AuthContext"
import {SafeProposal, SafeProposalState} from "../../types/safeProposal"
import EthersContext from "../../context/EthersContext"
import getSafeProposal from "../../api/firebase/safeProposal/getSafeProposal"
import getDAO from "../../api/firebase/DAO/getDAO"
import getOwners from "../../api/ethers/functions/gnosisSafe/getOwners"
import getVotingThreshold from "../../api/ethers/functions/gnosisSafe/getVotingThreshold"
import {getNonce} from "../../api/ethers/functions/gnosisSafe/safeUtils"

const useProposal = (
	id: string
): {
	proposal: SafeProposal | null
	gnosisVotingThreshold: number | null
	loading: boolean
	error: boolean
	canSign: boolean
} => {
	const [proposal, setProposal] = useState<SafeProposal | null>(null)
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
			const _proposal = await getSafeProposal(id)
			if (!_proposal) {
				throw new Error("Proposal not found")
			}
			let trueState: SafeProposalState = _proposal.state
			if (trueState === "active") {
				const nonce = await getNonce(_proposal.gnosisAddress, provider)
				if (_proposal.nonce < nonce) {
					trueState = "canceled"
				}
			}
			// We don't need DAO, but it will throw an error if it's not found, so we check for it
			const [votingThreshold, , owners] = await Promise.all([
				getVotingThreshold(_proposal.gnosisAddress, provider),
				getDAO(_proposal.gnosisAddress),
				getOwners(_proposal.gnosisAddress, provider)
			])
			setProposal({..._proposal, state: trueState})
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
