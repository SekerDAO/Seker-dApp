import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import MultiArtToken from "../../abis/MultiArtToken.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "./safeUtils"

export const signSendNFT = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	to: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nft = new Contract(nftAddress, MultiArtToken.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(nft, "transferFrom", [safeAddress, to, nftID], nonce)
	return safeSignMessage(signer, safeContract, call)
}

export const executeCreateZoraAuction = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	to: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nft = new Contract(nftAddress, MultiArtToken.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(nft, "transferFrom", [safeAddress, to, nftID], nonce)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
