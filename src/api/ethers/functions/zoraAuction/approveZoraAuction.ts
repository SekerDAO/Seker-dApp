import {JsonRpcSigner} from "@ethersproject/providers"
import Auction from "../../abis/ZoraAuction.json"
import {createSafeSignature, executeSafeTx, SafeSignature} from "../gnosisSafe/safeUtils"
const {REACT_APP_ZORA_ADDRESS} = process.env

export const signApproveZoraAuction = async (
	safeAddress: string,
	auctionID: number,
	signer: JsonRpcSigner
): Promise<SafeSignature> =>
	createSafeSignature(
		safeAddress,
		REACT_APP_ZORA_ADDRESS!,
		Auction.abi,
		"setAuctionApproval",
		[auctionID, true],
		signer
	)

export const executeApproveZoraAuction = async (
	safeAddress: string,
	auctionID: number,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> =>
	executeSafeTx(
		safeAddress,
		REACT_APP_ZORA_ADDRESS!,
		Auction.abi,
		"setAuctionApproval",
		[auctionID, true],
		signer,
		signatures
	)
