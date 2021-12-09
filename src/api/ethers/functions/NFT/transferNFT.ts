import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import config from "../../../../config"
import MultiArtToken from "../../abis/MultiArtToken.json"
import TWDomainToken from "../../abis/TWDomainToken.json"

const transferNFT = async (
	from: string,
	nftID: number,
	to: string,
	signer: JsonRpcSigner,
	customDomain?: string
): Promise<void> => {
	const nft = new Contract(
		customDomain ?? config.DOMAIN_ADDRESS,
		customDomain ? MultiArtToken.abi : TWDomainToken.abi,
		signer
	)
	const tx = await nft.transferFrom(from, to, nftID)
	await tx.wait()
}

export default transferNFT
