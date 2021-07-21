import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "./safeUtils"

export const signAddOwner = async (
	safeAddress: string,
	adminAddress: string,
	newThreshold: number,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, provider)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(
		safeContract,
		"addOwnerWithThreshold",
		[adminAddress, newThreshold],
		nonce
	)
	return safeSignMessage(signer, safeContract, call)
}

export const executeAddOwner = async (
	safeAddress: string,
	adminAddress: string,
	newThreshold: number,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(
		safeContract,
		"addOwnerWithThreshold",
		[adminAddress, newThreshold],
		nonce
	)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
