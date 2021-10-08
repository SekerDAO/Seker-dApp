import {Auction} from "../../types/auction"
import {useContext, useEffect, useState} from "react"
import getDAOAuctions from "../../api/firebase/auction/getDAOAuctions"
import EthersContext from "../../context/EthersContext"
import {JsonRpcProvider} from "@ethersproject/providers"
import getAuctionDetails from "../../api/ethers/functions/auction/getAuctionDetails"

const useDAOAuctions = (
	gnosisAddress: string
): {
	auctions: Auction[]
	loading: boolean
	error: boolean
} => {
	const {provider} = useContext(EthersContext)
	const [auctions, setAuctions] = useState<Auction[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const getData = async (address: string, _provider: JsonRpcProvider) => {
		const _auctions = await getDAOAuctions(address)
		return Promise.all(
			_auctions.map(async a => ({
				...a,
				...(await getAuctionDetails(a.id, _provider))
			}))
		)
	}

	useEffect(() => {
		if (provider) {
			setLoading(true)
			setError(false)
			getData(gnosisAddress, provider)
				.then(res => {
					setAuctions(res)
					setLoading(false)
				})
				.catch(e => {
					console.error(e)
					setError(true)
					setLoading(false)
				})
		}
	}, [gnosisAddress, provider])

	return {
		auctions,
		loading,
		error
	}
}

export default useDAOAuctions
