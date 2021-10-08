import {useContext, useEffect, useState} from "react"
import {NFT} from "../../types/NFT"
import getNFT from "../../api/firebase/NFT/getNFT"
import {Auction} from "../../types/auction"
import getNFTAuctions from "../../api/firebase/auction/getNFTAuctions"
import getAuctionDetails from "../../api/ethers/functions/auction/getAuctionDetails"
import EthersContext from "../../context/EthersContext"
import {JsonRpcProvider} from "@ethersproject/providers"

const useNFT = (
	id: string
): {
	nft: NFT | null
	auctions: Auction[]
	loading: boolean
	error: boolean
} => {
	const {provider} = useContext(EthersContext)
	const [nft, setNft] = useState<NFT | null>(null)
	const [auctions, setAuctions] = useState<Auction[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const getData = async (nftId: string, _provider: JsonRpcProvider | null) => {
		const _nft = await getNFT(nftId)
		if (!_provider) {
			return {nft: _nft}
		}
		const _auctions = await getNFTAuctions(_nft.id, _nft.address)

		return {
			nft: _nft,
			auctions: await Promise.all(
				_auctions.map(async a => ({...a, ...(await getAuctionDetails(a.id, _provider))}))
			)
		}
	}

	useEffect(() => {
		setLoading(true)
		setError(false)
		getData(id, provider)
			.then(res => {
				setNft(res.nft)
				if (res.auctions) {
					setAuctions(res.auctions)
				}
				setLoading(false)
			})
			.catch(e => {
				console.error(e)
				setError(true)
				setLoading(false)
			})
	}, [id, provider])

	return {
		nft,
		auctions,
		loading,
		error
	}
}

export default useNFT
