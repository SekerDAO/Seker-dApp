import {useContext, useEffect, useState} from "react"
import getOwners from "../../api/ethers/functions/gnosisSafe/getOwners"
import getVotingThreshold from "../../api/ethers/functions/gnosisSafe/getVotingThreshold"
import {getNonce} from "../../api/ethers/functions/gnosisSafe/safeUtils"
import getDAO from "../../api/firebase/DAO/getDAO"
import getSafeProposal from "../../api/firebase/safeProposal/getSafeProposal"
import {AuthContext} from "../../context/AuthContext"
import {ProviderContext} from "../../context/ProviderContext"
import {SafeProposal, SafeProposalState} from "../../types/safeProposal"

const useSafeProposal = (
	id: string
): {
	proposal: (SafeProposal & {proposalId: string; gnosisVotingThreshold: number}) | null
	loading: boolean
	error: boolean
	canSign: boolean
} => {
	const [proposal, setProposal] = useState<
		(SafeProposal & {proposalId: string; gnosisVotingThreshold: number}) | null
	>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const [canSign, setCanSign] = useState(false)
	const {connected, account} = useContext(AuthContext)
	const {provider} = useContext(ProviderContext)

	const getData = async () => {
		try {
			setLoading(true)
			setError(false)
			const proposalData = await getSafeProposal(id)
			if (!proposalData) {
				throw new Error("Proposal not found")
			}
			let trueState: SafeProposalState = proposalData.state
			if (trueState === "active") {
				const nonce = await getNonce(proposalData.gnosisAddress, provider)
				if (proposalData.nonce < nonce) {
					trueState = "outdated"
				}
			}
			// We don't need DAO, but it will throw an error if it's not found, so we check for it
			const [votingThreshold, , owners] = await Promise.all([
				getVotingThreshold(proposalData.gnosisAddress, provider),
				getDAO(proposalData.gnosisAddress),
				getOwners(proposalData.gnosisAddress, provider)
			])
			setProposal({
				...proposalData,
				state: trueState,
				gnosisVotingThreshold: votingThreshold,
				proposalId: id
			})
			setCanSign(
				!!(
					account &&
					connected &&
					owners.includes(account) &&
					trueState === "active" &&
					!proposalData.signatures?.find(s => s.signer.toLowerCase() === account)
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
		loading,
		error,
		canSign
	}
}

export default useSafeProposal
