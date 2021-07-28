import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import TWDomainToken from "../../abis/TWDomainToken.json"
import Auction from "../../abis/ZoraAuction.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "../gnosisSafe/safeUtils"
import {parseEther} from "@ethersproject/units"
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
	signer: JsonRpcSigner
): Promise<[SafeSignature]> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nft = new Contract(nftAddress, TWDomainToken.abi, signer)
	const auction = new Contract(REACT_APP_ZORA_ADDRESS!, Auction.abi, signer)
	let nonce = await safeContract.nonce()
	const call_0 = buildContractCall(nft, "approve", [REACT_APP_ZORA_ADDRESS, nftID], nonce)
	const call_1 = buildContractCall(
		auction,
		"createAuction",
		[
			nftID,
			nftAddress,
			duration,
			parseEther(String(reservePrice)),
			curator,
			curatorFeePercentage,
			auctionCurrency
		],
		nonce++
	)
	const approveSig = safeSignMessage(signer, safeContract, call_0)
	const createAuctionSig = safeSignMessage(signer, safeContract, call_1)
	const sigArray = [approveSig, createAuctionSig]
	return sigArray
}

export const executeNFTApproval = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nft = new Contract(nftAddress, TWDomainToken.abi, signer)
	const nonce = await safeContract.nonce()
	const call_0 = buildContractCall(nft, "approve", [REACT_APP_ZORA_ADDRESS, nftID], nonce)
	const tx = await executeTx(safeContract, call_0, signatures)
	await tx.wait()
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
	const auction = new Contract(REACT_APP_ZORA_ADDRESS!, Auction.abi, signer)
	let nonce = await safeContract.nonce()
	const call = buildContractCall(
		auction,
		"createAuction",
		[
			nftID,
			nftAddress,
			duration,
			parseEther(String(reservePrice)),
			curator,
			curatorFeePercentage,
			auctionCurrency
		],
		nonce++
	)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
