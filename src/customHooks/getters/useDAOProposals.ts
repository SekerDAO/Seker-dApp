import {useEffect, useState} from "react"
import {Proposal} from "../../types/proposal"
import getDAOProposals from "../../api/firebase/proposal/getDAOProposals"

const useDAOProposals = (
	daoAddress: string
): {
	proposals: Proposal[]
	loading: boolean
	error: boolean
} => {
	// eslint-disable-next-line no-shadow
	const [proposals, setProposals] = useState<Proposal[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	useEffect(() => {
		setLoading(true)
		setError(false)
		getDAOProposals(daoAddress)
			.then(res => {
				setLoading(false)
				setProposals(res.docs.map(doc => doc.data()))
			})
			.catch(e => {
				console.error(e)
				setError(true)
				setLoading(false)
			})
	}, [daoAddress])

	return {
		proposals,
		loading,
		error
	}
}

export default useDAOProposals
