import {JsonRpcSigner} from "@ethersproject/providers"
import MultiArtToken from "../../abis/MultiArtToken.json"
import {createSafeSignature, executeSafeTx, SafeSignature} from "./safeUtils"

export const signSendNFT = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	to: string,
	signer: JsonRpcSigner
): Promise<[SafeSignature, number]> =>
	createSafeSignature(
		safeAddress,
		nftAddress,
		MultiArtToken.abi,
		"transferFrom",
		[safeAddress, to, nftID],
		signer
	)

export const executeSendNFT = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	to: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> =>
	executeSafeTx(
		safeAddress,
		nftAddress,
		MultiArtToken.abi,
		"transferFrom",
		[safeAddress, to, nftID],
		signer,
		signatures
	)
