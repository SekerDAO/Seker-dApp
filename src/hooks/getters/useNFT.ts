import getNFT from "../../api/firebase/NFT/getNFT"
import EthersContext from "../../context/EthersContext"
import {NFT} from "../../types/NFT"
import {Auction} from "../../types/auction"
import {JsonRpcProvider} from "@ethersproject/providers"
import {useContext, useEffect, useState} from "react"

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

		return {
			nft: _nft,
			auctions: [] // TODO
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
