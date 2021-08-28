import {JsonRpcSigner} from "@ethersproject/providers"
import Auction from "../../abis/ZoraAuction.json"
import {createSafeSignature, executeSafeTx, SafeSignature} from "../gnosisSafe/safeUtils"
const {REACT_APP_ZORA_ADDRESS} = process.env

export const signCancelZoraAuction = async (
	safeAddress: string,
	auctionID: number,
	signer: JsonRpcSigner
): Promise<SafeSignature> =>
	createSafeSignature(
		safeAddress,
		REACT_APP_ZORA_ADDRESS!,
		Auction.abi,
		"cancelAuction",
		[auctionID],
		signer
	)

export const executeCancelZoraAuction = async (
	safeAddress: string,
	auctionID: number,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> =>
	executeSafeTx(
		safeAddress,
		REACT_APP_ZORA_ADDRESS!,
		Auction.abi,
		"cancelAuction",
		[auctionID],
		signer,
		signatures
	)
