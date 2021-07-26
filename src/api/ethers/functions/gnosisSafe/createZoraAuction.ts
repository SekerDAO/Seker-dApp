import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import Auction from "../../abis/ZoraAuction.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "./safeUtils"
const {REACT_APP_ZORA_ADDRESS} = process.env

export const signCreateZoraAuction = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	duration: number,
	reservePrice: number,
	curator: string,
	curatorFeePercentage: number,
	auctionCurrency: string,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, provider)
	const auction = new Contract(REACT_APP_ZORA_ADDRESS, Auction.abi, provider)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(
		auction,
		"createAuction",
		[nftID, nftAddress, duration, reservePrice, curator, curatorFeePercentage, auctionCurrency],
		nonce
	)
	return safeSignMessage(signer, safeContract, call)
}

export const executeCreateZoraAuction = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	duration: number,
	reservePrice: number,
	curator: string,
	curatorFeePercentage: number,
	auctionCurrency: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const auction = new Contract(REACT_APP_ZORA_ADDRESS, Auction.abi, provider)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(
		auction,
		"createAuction",
		[nftID, nftAddress, duration, reservePrice, curator, curatorFeePercentage, auctionCurrency],
		nonce
	)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
