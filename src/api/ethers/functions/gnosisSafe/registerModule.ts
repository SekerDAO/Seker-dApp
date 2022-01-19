import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {
	buildContractCall,
	executeTx,
	SafeSignature,
	safeSignMessage,
	SafeTransaction
} from "./safeUtils"

export const getRegisterModuleTx = async (
	safeAddress: string,
	moduleAddress: string,
	signer: JsonRpcSigner,
	zeroNonce = false
): Promise<SafeTransaction> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = zeroNonce ? 0 : await safeContract.nonce()
	return buildContractCall(safeContract, "enableModule", [moduleAddress], nonce)
}

export const signRegisterModuleTx = async (
	safeAddress: string,
	moduleAddress: string,
	signer: JsonRpcSigner
): Promise<[SafeSignature, number]> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(safeContract, "enableModule", [moduleAddress], nonce)
	return [await safeSignMessage(signer, safeContract, call), nonce.toNumber()]
}

export const executeRegisterModuleTx = async (
	safeAddress: string,
	moduleAddress: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(safeContract, "enableModule", [moduleAddress], nonce)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
