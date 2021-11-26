import {getNonce} from "../../api/ethers/functions/gnosisSafe/safeUtils"
import getSafeProposals from "../../api/firebase/safeProposal/getSafeProposals"
import EthersContext from "../../context/EthersContext"
import {SafeProposal} from "../../types/safeProposal"
import {useContext, useEffect, useState} from "react"

const useProposals = (
	gnosisAddress: string
): {
	proposals: (SafeProposal & {proposalId: string})[]
	loading: boolean
	error: boolean
	refetch: () => void
} => {
	const [proposals, setProposals] = useState<(SafeProposal & {proposalId: string})[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {provider} = useContext(EthersContext)

	const getData = async () => {
		setLoading(true)
		setError(false)
		try {
			const [proposalsSnapshots, nonce] = await Promise.all([
				getSafeProposals(gnosisAddress),
				getNonce(gnosisAddress, provider)
			])
			const firebaseData = proposalsSnapshots.docs.map(doc => ({
				...doc.data(),
				proposalId: doc.id
			}))
			setProposals(
				firebaseData.map(
					p =>
						({
							...p,
							id: Number(p.id),
							state: p.state === "active" && p.nonce < nonce ? "outdated" : p.state
						} as SafeProposal & {proposalId: string})
				)
			)
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
