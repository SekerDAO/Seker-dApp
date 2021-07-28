import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import TWDomainToken from "../../abis/TWDomainToken.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "../gnosisSafe/safeUtils"
const {REACT_APP_ZORA_ADDRESS} = process.env

export const signApproveNFTForZoraAuction = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	duration: number,
	reservePrice: number,
	curator: string,
	curatorFeePercentage: number,
	auctionCurrency: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nft = new Contract(nftAddress, TWDomainToken.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(nft, "approve", [REACT_APP_ZORA_ADDRESS, nftID], nonce)
	return safeSignMessage(signer, safeContract, call)
}

export const executeApproveNFTForZoraAuction = async (
	safeAddress: string,
	nftID: number,
	nftAddress: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nft = new Contract(nftAddress, TWDomainToken.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(nft, "approve", [REACT_APP_ZORA_ADDRESS, nftID], nonce)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
