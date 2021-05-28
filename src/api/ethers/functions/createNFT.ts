import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import TWDomainToken from "../abis/TWDomainToken.json"
import MultiArtToken from "../abis/MultiArtToken.json"
import {Contract} from "@ethersproject/contracts"
const {REACT_APP_DOMAIN_ADDRESS} = process.env

const createNFT = async (
	hashes: string[],
	numberOfEditions: number,
	signer: JsonRpcSigner,
	provider: Web3Provider,
	customDomain?: string
): Promise<void> => {
	const nft = new Contract(
		customDomain ?? REACT_APP_DOMAIN_ADDRESS!,
		customDomain ? MultiArtToken.abi : TWDomainToken.abi,
		signer
	)
	await nft.mintEdition(hashes, numberOfEditions)
}

export default createNFT
