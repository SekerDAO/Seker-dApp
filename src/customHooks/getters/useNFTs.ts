import {useContext, useEffect, useState} from "react"
import {NFTQueryParams, NFTSnapshot} from "../../types/NFT"
import getNFTs from "../../api/firebase/NFT/getNFTs"
import getNFTZoraAuctions from "../../api/firebase/zoraAuction/getNFTZoraAuctions"
import getAuctionDetails from "../../api/ethers/functions/zoraAuction/getAuctionDetails"
import {Web3Provider} from "@ethersproject/providers"
import EthersContext from "../../context/EthersContext"

const useNFTs = ({
	category,
	user,
	limit,
	after
}: NFTQueryParams): {
	NFTs: {
		totalCount: number
		data: NFTSnapshot[]
		nftsAreOnAuctions: boolean[]
	}
	loading: boolean
	error: boolean
} => {
	const [NFTs, setNFTs] = useState<{
		totalCount: number
		data: NFTSnapshot[]
		nftsAreOnAuctions: boolean[]
	}>({
		totalCount: 0,
		data: [],
		nftsAreOnAuctions: []
	})
	const {provider} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const getData = async (
		_provider: Web3Provider,
		_category?: string,
		_user?: string,
		_limit?: number,
		_after: NFTSnapshot | null = null
	) => {
		setLoading(true)
		setError(false)
		try {
			const nftsSnapshot = await getNFTs({
				category: _category,
				user: _user,
				limit: _limit,
				after: _after
			})
			const nftsAreOnAuctions: boolean[] = []
			for (let i = 0; i < nftsSnapshot.data.length; i++) {
				const {id, address} = nftsSnapshot.data[i].data()
				const nftAuctions = await getNFTZoraAuctions(id, address)
				const details = await Promise.all(nftAuctions.map(a => getAuctionDetails(a.id, _provider)))
				nftsAreOnAuctions.push(
					details.reduce(
						(acc: boolean, cur) =>
							acc || ["live", "approved", "waitingApproval"].includes(cur.state),
						false
					)
				)
			}
			setNFTs(prevState => ({
				totalCount: nftsSnapshot.totalCount,
				data: [...prevState.data, ...nftsSnapshot.data],
				nftsAreOnAuctions
			}))
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}

	useEffect(() => {
		if (provider) {
			getData(provider, category, user, limit, after)
		}
	}, [category, user, limit, after, provider])

	return {
		NFTs,
		loading,
		error
	}
}

export default useNFTs
