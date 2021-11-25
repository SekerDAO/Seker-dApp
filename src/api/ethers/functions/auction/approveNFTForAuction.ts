import {JsonRpcSigner} from "@ethersproject/providers"
import TWDomainToken from "../../abis/TWDomainToken.json"
import {createSafeSignature, executeSafeTx, SafeSignature} from "../gnosisSafe/safeUtils"
const {REACT_APP_ZORA_ADDRESS} = process.env

export const signApproveNFTForAuction = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	duration: number,
	reservePrice: number,
	curator: string,
	curatorFeePercentage: number,
	auctionCurrency: string,
	signer: JsonRpcSigner
): Promise<[SafeSignature, number]> =>
	createSafeSignature(
		safeAddress,
		nftAddress,
		TWDomainToken.abi,
		"approve",
		[REACT_APP_ZORA_ADDRESS, nftID],
		signer
	)

export const executeApproveNFTForAuction = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> =>
	executeSafeTx(
		safeAddress,
		nftAddress,
		TWDomainToken.abi,
		"approve",
		[REACT_APP_ZORA_ADDRESS, nftID],
		signer,
		signatures
	)
