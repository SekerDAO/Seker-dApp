import {JsonRpcSigner} from "@ethersproject/providers"
import config from "../../../../config"
import Auction from "../../abis/Auction.json"
import {createSafeSignature, executeSafeTx, SafeSignature} from "../gnosisSafe/safeUtils"

export const signCancelAuction = async (
	safeAddress: string,
	auctionID: number,
	signer: JsonRpcSigner
): Promise<[SafeSignature, number]> =>
	createSafeSignature(
		safeAddress,
		config.AUCTION_ADDRESS!,
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
		config.AUCTION_ADDRESS,
		Auction.abi,
		"cancelAuction",
		[auctionID],
		signer,
		signatures
	)
