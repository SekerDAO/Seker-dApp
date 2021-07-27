import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import Auction from "../../abis/ZoraAuction.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "../gnosisSafe/safeUtils"
const {REACT_APP_ZORA_ADDRESS} = process.env

export const signApproveZoraAuction = async (
	safeAddress: string,
	auctionID: number,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const auction = new Contract(REACT_APP_ZORA_ADDRESS!, Auction.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(auction, "setAuctionApproval", [auctionID, true], nonce)
	return safeSignMessage(signer, safeContract, call)
}

export const executeApproveZoraAuction = async (
	safeAddress: string,
	auctionID: number,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const auction = new Contract(REACT_APP_ZORA_ADDRESS!, Auction.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(auction, "setAuctionApproval", [auctionID, true], nonce)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
