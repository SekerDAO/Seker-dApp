import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "./safeUtils"

export const signHookupProposalModule = async (
	safeAddress: string,
	proposalModule: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(safeContract, "enableModule", [proposalModule], nonce)
	return safeSignMessage(signer, safeContract, call)
}

export const executeHookupProposalModule = async (
	safeAddress: string,
	proposalModule: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(safeContract, "enableModule", [proposalModule], nonce)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
