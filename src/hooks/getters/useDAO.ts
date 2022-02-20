import {useContext, useEffect, useState} from "react"
import {getStrategies} from "../../api/ethers/functions/Usul/voting/usulStrategies"
import getOwners from "../../api/ethers/functions/gnosisSafe/getOwners"
import getVotingThreshold from "../../api/ethers/functions/gnosisSafe/getVotingThreshold"
import getDAO from "../../api/firebase/DAO/getDAO"
import {ProviderContext} from "../../context/ProviderContext"
import {DAO} from "../../types/DAO"

const useDAO = (
	gnosisAddress: string
): {
	dao: DAO | null
	loading: boolean
	error: boolean
	refetch: () => Promise<void>
} => {
	const [dao, setDao] = useState<DAO | null>(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)
	const {provider, sideChainProvider} = useContext(ProviderContext)

	const getInfo = async () => {
		setLoading(true)
		setError(false)
		try {
			const _dao = await getDAO(gnosisAddress)
			const gnosisVotingThreshold = await getVotingThreshold(gnosisAddress, provider)
			const owners = await getOwners(gnosisAddress, provider)
			setDao({
				..._dao,
				gnosisVotingThreshold,
				owners,
				usuls: await Promise.all(
					_dao.usuls.map(async usul => ({
						...usul,
						strategies: await getStrategies(
							usul.usulAddress,
							usul.deployType === "usulSingle" ? provider : sideChainProvider
						)
					}))
				)
			})
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}

	useEffect(() => {
		getInfo()
	}, [gnosisAddress])

	return {
		dao,
		loading,
		error,
		refetch: getInfo
	}
}

export default useDAO
