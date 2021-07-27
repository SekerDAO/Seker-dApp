import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import TWDomainToken from "../../abis/TWDomainToken.json"
import MultiArtToken from "../../abis/MultiArtToken.json"
import {Contract} from "@ethersproject/contracts"
const {REACT_APP_DOMAIN_ADDRESS} = process.env

export const transferNFT = async (
	senderAddress: string,
	nftID: number,
	nftAddress: string,
	daoAddress: string,
	signer: JsonRpcSigner
): Promise<boolean> => {
	const nft = new Contract(nftAddress!, MultiArtToken.abi, signer)
	const tx = await nft.trasnferFrom(senderAddress, daoAddress, nftID)
	await tx.wait()
	return true
}
