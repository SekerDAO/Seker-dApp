import MultiArtToken from "../../abis/MultiArtToken.json"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcProvider} from "@ethersproject/providers"

const checkNFTOwner = async (
	account: string,
	address: string,
	id: string,
	provider: JsonRpcProvider
): Promise<boolean> => {
	const nftContract = new Contract(address, MultiArtToken.abi, provider)
	const owner = await nftContract.ownerOf(id)
	return owner === account
}

export default checkNFTOwner
