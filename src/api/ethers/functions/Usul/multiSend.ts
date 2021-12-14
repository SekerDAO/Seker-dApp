import {arrayify} from "@ethersproject/bytes"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {pack} from "@ethersproject/solidity"
import config from "../../../../config"
import {PrebuiltTx} from "../../../../types/common"
import {prepareArguments} from "../../../../utlls"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import MultiSend from "../../abis/MultiSend.json"
import {
	buildContractCall,
	executeTx,
	MetaTransaction,
	SafeSignature,
	safeSignMessage,
	SafeTransaction
} from "../gnosisSafe/safeUtils"

const encodeMetaTransaction = (tx: MetaTransaction): string => {
	const data = arrayify(tx.data)
	const encoded = pack(
		["uint8", "address", "uint256", "uint256", "bytes"],
		[tx.operation, tx.to, tx.value, data.length, data]
	)
	return encoded.slice(2)
}

const encodeMultiSend = (txs: MetaTransaction[]): string =>
	"0x" + txs.map(tx => encodeMetaTransaction(tx)).join("")

export const buildMultiSendTx = async (
	multiSendTxs: SafeTransaction[],
	safeAddress: string,
	signer: JsonRpcSigner
): Promise<SafeTransaction> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const multiSendContract = new Contract(config.MULTI_SEND_ADDRESS, MultiSend.abi, signer)
	return buildContractCall(
		multiSendContract,
		"multiSend",
		[encodeMultiSend(multiSendTxs)],
		nonce,
		true
	)
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

export const getMultiSendTxBuild = async (
	safeAddress: string,
	txs: PrebuiltTx[],
	signer: JsonRpcSigner
): Promise<SafeTransaction> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const builtTxs = txs.map(tx => {
		const targetContract = new Contract(tx.address, tx.contractMethods, signer)
		return buildContractCall(
			targetContract,
			tx.contractMethods[tx.selectedMethodIndex].name,
			prepareArguments(
				tx.args,
				tx.contractMethods[tx.selectedMethodIndex].inputs.map(i => i.type)
			),
			nonce.toNumber()
		)
	})
	return buildMultiSendTx(builtTxs, safeAddress, signer)
}
