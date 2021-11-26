import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import MultiSend from "../../abis/MultiSend.json"
import {
	buildMultiSendSafeTx,
	executeTx,
	SafeSignature,
	safeSignMessage,
	SafeTransaction
} from "../gnosisSafe/safeUtils"

const {REACT_APP_MULTI_SEND_ADDRESS} = process.env

export const buildMultiSendTx = async (
	multiSendTxs: SafeTransaction[],
	safeAddress: string,
	signer: JsonRpcSigner
): Promise<SafeTransaction> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const multiSendContract = new Contract(REACT_APP_MULTI_SEND_ADDRESS!, MultiSend.abi, signer)
	return buildMultiSendSafeTx(multiSendContract, multiSendTxs, nonce)
}

export const signMultiSend = async (
	multiSendTx: SafeTransaction,
	safeAddress: string,
	signer: JsonRpcSigner
): Promise<[SafeSignature, number]> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	return [await safeSignMessage(signer, safeContract, multiSendTx), nonce.toNumber()]
}

export const executeMultiSend = async (
	multiSendTx: SafeTransaction,
	safeAddress: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const tx = await executeTx(safeContract, multiSendTx, signatures)
	await tx.wait()
}
