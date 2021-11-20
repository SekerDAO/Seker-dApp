import {useEffect, useState} from "react"
import {SafeProposal} from "../../types/safeProposal"
import getSafeProposals from "../../api/firebase/safeProposal/getSafeProposals"

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

	const getData = async () => {
		setLoading(true)
		setError(false)
		try {
			const firebaseData = (await getSafeProposals(gnosisAddress)).docs.map(doc => ({
				...doc.data(),
				proposalId: doc.id
			}))
			setProposals(
				firebaseData.map(
					p =>
						({
							...p,
							id: Number(p.id),
							state: p.state
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
