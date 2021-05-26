import {Web3Provider} from "@ethersproject/providers"
// prettier-ignore
import MultiArtToken from "../abis/MultiArtToken.json"
import {Contract} from "@ethersproject/contracts"
import firebase from "firebase"

// prettier-ignore
const checkOwner = async (account: string, address: string, id: string, provider: Web3Provider | null): Promise<boolean> => {
	try{
		// @ts-expect-error: Let's ignore a compile error like this unreachable code
		const nftContract = new Contract(address, MultiArtToken.abi, provider)
		const owner = await nftContract.ownerOf(id)
		return owner === account
	} catch (err) {
		return false
	}
}

const loadNFT = async (account: string, address: string, id: string): Promise<void> => {
	//todo: enter into DB here
}

export {loadNFT, checkOwner}
