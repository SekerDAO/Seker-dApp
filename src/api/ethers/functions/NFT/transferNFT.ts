import {JsonRpcSigner} from "@ethersproject/providers"
import MultiArtToken from "../../abis/MultiArtToken.json"
import {Contract} from "@ethersproject/contracts"

export const transferNFT = async (
	senderAddress: string,
	nftID: number,
	nftAddress: string,
	daoAddress: string,
	signer: JsonRpcSigner
): Promise<boolean> => {
	const nft = new Contract(nftAddress, MultiArtToken.abi, signer)
	const tx = await nft.trasnferFrom(senderAddress, daoAddress, nftID)
	await tx.wait()
	return true
}
