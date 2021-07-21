import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import {formatEther} from "@ethersproject/units"
import {buildContractCall, safeSignMessage, SafeSignature} from "../testFunctions"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"

export const signAddOwner = async (
	safeAddress: string,
	adminAddress: string,
	newThreshold: number,
	signer: JsonRpcSigner,
	provider: Web3Provider
): Promise<SafeSignature> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, provider)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(safeContract, "addOwnerThreshold", [adminAddress, newThreshold], nonce)
	const signature = await safeSignMessage(signer, safeContract, call)
	return signature
}
