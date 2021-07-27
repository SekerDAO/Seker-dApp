import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import ERC20 from "../../abis/GovToken.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "./safeUtils"

export const signSendERC20 = async (
	safeAddress: string,
	amount: number,
	erc20Address: string,
	to: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const erc20 = new Contract(erc20Address, ERC20.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(erc20, "transfer", [to, amount], nonce)
	return safeSignMessage(signer, safeContract, call)
}

export const executeSendERC20 = async (
	safeAddress: string,
	amount: number,
	erc20Address: string,
	to: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const erc20 = new Contract(erc20Address, ERC20.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(erc20, "transfer", [to, amount], nonce)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
