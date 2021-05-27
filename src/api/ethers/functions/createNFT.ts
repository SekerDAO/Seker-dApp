import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import TWDomainToken from "../abis/TWDomainToken.json"
import {Contract} from "@ethersproject/contracts"

const createNFT = async (
	account: string,
	hashes: string[],
	numberOfEditions: string,
	nftAddress: string,
	isCustomDomain: boolean,
	signer: JsonRpcSigner,
	provider: Web3Provider
): Promise<void> => {
	const nft = new Contract(nftAddress, TWDomainToken.abi, signer)
	const _tx = await nft.mintEdition(hashes, parseInt(numberOfEditions))
	provider.once(_tx.hash, receipt => {
		console.log("Transaction Minded: " + receipt.transactionHash)
		console.log(receipt)
	})
}

export default createNFT
