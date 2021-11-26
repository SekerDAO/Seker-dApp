import {JsonRpcSigner} from "@ethersproject/providers"
import Auction from "../../abis/Auction.json"
import {createSafeSignature, executeSafeTx, SafeSignature} from "../gnosisSafe/safeUtils"

const {REACT_APP_ZORA_ADDRESS} = process.env

export const signCancelAuction = async (
	safeAddress: string,
	auctionID: number,
	signer: JsonRpcSigner
): Promise<[SafeSignature, number]> =>
	createSafeSignature(
		safeAddress,
		REACT_APP_ZORA_ADDRESS!,
		Auction.abi,
		"cancelAuction",
		[auctionID],
		signer
	)

export const executeCancelAuction = async (
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
