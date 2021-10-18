import {JsonRpcSigner} from "@ethersproject/providers"
import Seele from "../../abis/Seele.json"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {Contract} from "@ethersproject/contracts"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "../gnosisSafe/safeUtils"

export const registerSeele = async (
	gnosisAddress: string,
	seeleAddress: string,
	to: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const safeContract = new Contract(gnosisAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(safeContract, "enableModule", [seeleAddress], nonce)
	return safeSignMessage(signer, safeContract, call)
}

export const executeRegisterSeele = async (
	safeAddress: string,
	adminAddress: string,
	seeleAddress: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(safeContract, "enableModule", [seeleAddress], nonce)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
