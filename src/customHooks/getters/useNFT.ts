import {useContext, useEffect, useState} from "react"
import {NFT} from "../../types/NFT"
import getNFT from "../../api/firebase/NFT/getNFT"
import {ZoraAuction} from "../../types/zoraAuction"
import getNFTZoraAuctions from "../../api/firebase/zoraAuction/getNFTZoraAuctions"
import getAuctionDetails from "../../api/ethers/functions/zoraAuction/getAuctionDetails"
import EthersContext from "../../context/EthersContext"
import {JsonRpcProvider} from "@ethersproject/providers"

const useNFT = (
	id: string
): {
	nft: NFT | null
	auctions: ZoraAuction[]
	loading: boolean
	error: boolean
} => {
	const {provider} = useContext(EthersContext)
	const [nft, setNft] = useState<NFT | null>(null)
	const [auctions, setAuctions] = useState<ZoraAuction[]>([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(false)

	const getData = async (nftId: string, _provider: JsonRpcProvider | null) => {
		const _nft = await getNFT(nftId)
		if (!_provider) {
			return {nft: _nft}
		}
		const _auctions = await getNFTZoraAuctions(_nft.id, _nft.address)

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
