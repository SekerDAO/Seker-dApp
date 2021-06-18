import {Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import MultiArtToken from "../../abis/MultiArtToken.json"

const checkNFTOwner = async (
	account: string,
	address: string,
	id: string,
	provider: Web3Provider
): Promise<boolean> => {
	const nftContract = new Contract(address, MultiArtToken.abi, provider)
	const owner = await nftContract.ownerOf(id)
	return owner === account
}

export default checkNFTOwner
