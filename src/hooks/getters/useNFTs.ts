import {useContext, useEffect, useState} from "react"
import {NFTQueryParams, NFTSnapshot, NftSort} from "../../types/NFT"
import getNFTs from "../../api/firebase/NFT/getNFTs"
import getAuctionDetails from "../../api/ethers/functions/auction/getAuctionDetails"
import {JsonRpcProvider} from "@ethersproject/providers"
import EthersContext from "../../context/EthersContext"
import {Auction} from "../../types/auction"

const useNFTs = ({
	user,
	limit,
	after,
	sort
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
		reset: boolean,
		_provider: JsonRpcProvider,
		_sort: NftSort,
		_user?: string,
		_limit?: number,
		_after: NFTSnapshot | null = null
	) => {
		setLoading(true)
		setError(false)
		try {
			const nftsSnapshot = await getNFTs({
				sort: _sort,
				user: _user,
				limit: _limit,
				after: _after
			})
			const nftsAreOnAuctions: boolean[] = []
			for (let i = 0; i < nftsSnapshot.data.length; i++) {
				// const {id, address} = nftsSnapshot.data[i].data()
				const nftAuctions: Auction[] = [] // TODO
				const details = await Promise.all(nftAuctions.map(a => getAuctionDetails(a.id, _provider)))
				nftsAreOnAuctions.push(
					details.reduce(
						(acc: boolean, cur) =>
							acc || ["live", "approved", "waitingApproval"].includes(cur.state),
						false
					)
				)
			}
			if (reset) {
				setNFTs({
					totalCount: nftsSnapshot.totalCount,
					data: nftsSnapshot.data,
					nftsAreOnAuctions
				})
			} else {
				setNFTs(prevState => ({
					totalCount: nftsSnapshot.totalCount,
					data: [...prevState.data, ...nftsSnapshot.data],
					nftsAreOnAuctions: [...prevState.nftsAreOnAuctions, ...nftsAreOnAuctions]
				}))
			}
		} catch (e) {
			console.error(e)
			setError(true)
		}
		setLoading(false)
	}

	useEffect(() => {
		if (provider) {
			getData(after === null, provider, sort, user, limit, after)
		}
	}, [sort, user, limit, after, provider])

	return {
		NFTs,
		loading,
		error
	}
}

export default useNFTs
