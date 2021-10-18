import {JsonRpcSigner} from "@ethersproject/providers"
import Seele from "../../abis/Seele.json"
import OZLinearVoting from "../../abis/OZLinearVoting.json"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {Contract} from "@ethersproject/contracts"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "../gnosisSafe/safeUtils"

export const registerOZLinearVoting = async (
	gnosisAddress: string,
	seeleAddress: string,
	OZLinearVotingAddress: string,
	to: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const seele = new Contract(seeleAddress, Seele.abi, signer)
	const safeContract = new Contract(gnosisAddress, GnosisSafeL2.abi, signer)
	const call = buildContractCall(seele, "enableStrategy", [OZLinearVotingAddress], 0)
	return safeSignMessage(signer, safeContract, call)
}

export const executeRegisterOZStrategy = async (
	safeAddress: string,
	adminAddress: string,
	seeleAddress: string,
	OZLinearVotingAddress: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const seele = new Contract(seeleAddress, Seele.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(seele, "enableStrategy", [OZLinearVotingAddress], 0)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
