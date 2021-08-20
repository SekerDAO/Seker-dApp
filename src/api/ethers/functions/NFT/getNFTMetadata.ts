import {JsonRpcProvider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import MultiArtToken from "../../abis/MultiArtToken.json"
import {NFTMetadata} from "../../../../types/NFT"

const getNFTMetadata = async (
	nftAddress: string,
	nftId: string,
	provider: JsonRpcProvider
): Promise<NFTMetadata> => {
	const nftContract = new Contract(nftAddress, MultiArtToken.abi, provider)
	const uri = await nftContract.tokenURI(nftId)
	const res = await fetch(uri)
	return res.json()
}

export default getNFTMetadata
