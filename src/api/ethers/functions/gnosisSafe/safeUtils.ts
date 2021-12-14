import {BigNumber, BigNumberish} from "@ethersproject/bignumber"
import {arrayify} from "@ethersproject/bytes"
import {AddressZero} from "@ethersproject/constants"
import {Contract, ContractInterface} from "@ethersproject/contracts"
import {_TypedDataEncoder} from "@ethersproject/hash"
import {JsonRpcProvider, JsonRpcSigner, TransactionResponse} from "@ethersproject/providers"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"

const EIP712_SAFE_TX_TYPE = {
	SafeTx: [
		{type: "address", name: "to"},
		{type: "uint256", name: "value"},
		{type: "bytes", name: "data"},
		{type: "uint8", name: "operation"},
		{type: "uint256", name: "safeTxGas"},
		{type: "uint256", name: "baseGas"},
		{type: "uint256", name: "gasPrice"},
		{type: "address", name: "gasToken"},
		{type: "address", name: "refundReceiver"},
		{type: "uint256", name: "nonce"}
	]
}

export type MetaTransaction = {
	to: string
	value: string | number | BigNumber
	data: string
	operation: number
}

export type SafeTransaction = MetaTransaction & {
	safeTxGas: string | number
	baseGas: string | number
	gasPrice: string | number
	gasToken: string
	refundReceiver: string
	nonce: string | number
}

export interface SafeSignature {
	signer: string
	data: string
}

const calculateSafeTransactionHash = (
	safe: Contract,
	safeTx: SafeTransaction,
	chainId: BigNumberish
): string =>
	_TypedDataEncoder.hash({verifyingContract: safe.address, chainId}, EIP712_SAFE_TX_TYPE, safeTx)

const signHash = async (signer: JsonRpcSigner, hash: string): Promise<SafeSignature> => {
	const typedDataHash = arrayify(hash)
	const signerAddress = await signer.getAddress()
	return {
		signer: signerAddress,
		data: (await signer.signMessage(typedDataHash)).replace(/1b$/, "1f").replace(/1c$/, "20")
	}
}

const buildSignatureBytes = (signatures: SafeSignature[]): string => {
	signatures.sort((left, right) =>
		left.signer.toLowerCase().localeCompare(right.signer.toLowerCase())
	)
	let signatureBytes = "0x"
	for (const sig of signatures) {
		signatureBytes += sig.data.slice(2)
	}
	return signatureBytes
}

const buildSafeTransaction = (template: {
	to: string
	value?: BigNumber | number | string
	data?: string
	operation?: number
	safeTxGas?: number | string
	baseGas?: number | string
	gasPrice?: number | string
	gasToken?: string
	refundReceiver?: string
	nonce: number
}): SafeTransaction => ({
	to: template.to,
	value: template.value || 0,
	data: template.data || "0x",
	operation: template.operation || 0,
	safeTxGas: template.safeTxGas || 0,
	baseGas: template.baseGas || 0,
	gasPrice: template.gasPrice || 0,
	gasToken: template.gasToken || AddressZero,
	refundReceiver: template.refundReceiver || AddressZero,
	nonce: template.nonce
})

export const buildContractCall = (
	contract: Contract,
	method: string,
	params: unknown[],
	nonce: number,
	delegateCall?: boolean,
	overrides?: Partial<SafeTransaction>
): SafeTransaction => {
	const data = contract.interface.encodeFunctionData(method, params)
	return buildSafeTransaction(
		Object.assign(
			{
				to: contract.address,
				data,
				operation: delegateCall ? 1 : 0,
				nonce
			},
			overrides
		)
	)
}

export const buildContractCallVariable = (
	contract: Contract,
	address: string,
	method: string,
	params: unknown[],
	nonce: number,
	delegateCall?: boolean,
	overrides?: Partial<SafeTransaction>
): SafeTransaction => {
	const data = contract.interface.encodeFunctionData(method, params)
	return buildSafeTransaction(
		Object.assign(
			{
				to: address,
				data,
				operation: delegateCall ? 1 : 0,
				nonce
			},
			overrides
		)
	)
}

export const executeTx = async (
	safe: Contract,
	safeTx: SafeTransaction,
	signatures: SafeSignature[],
	overrides?: unknown
): Promise<TransactionResponse> => {
	const signatureBytes = buildSignatureBytes(signatures)
	return safe.execTransaction(
		safeTx.to,
		safeTx.value,
		safeTx.data,
		safeTx.operation,
		safeTx.safeTxGas,
		safeTx.baseGas,
		safeTx.gasPrice,
		safeTx.gasToken,
		safeTx.refundReceiver,
		signatureBytes,
		overrides || {}
	)
}

export const safeSignMessage = async (
	signer: JsonRpcSigner,
	safe: Contract,
	safeTx: SafeTransaction,
	chainId?: BigNumberish
): Promise<SafeSignature> => {
	const cid = chainId || (await signer.provider!.getNetwork()).chainId
	return signHash(signer, calculateSafeTransactionHash(safe, safeTx, cid))
}

export const createSafeSignature = async (
	safeAddress: string,
	contractAddress: string,
	contractAbi: ContractInterface,
	method: string,
	args: unknown[],
	signer: JsonRpcSigner
): Promise<[SafeSignature, number]> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const targetContract = new Contract(contractAddress, contractAbi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(targetContract, method, args, nonce)
	return [await safeSignMessage(signer, safeContract, call), nonce.toString()]
}

export const executeSafeTx = async (
	safeAddress: string,
	contractAddress: string,
	contractAbi: ContractInterface,
	method: string,
	args: unknown[],
	signer: JsonRpcSigner,
	signatures: SafeSignature[]
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const targetContract = new Contract(contractAddress, contractAbi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(targetContract, method, args, nonce)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}

export const getNonce = async (address: string, provider: JsonRpcProvider): Promise<number> => {
	const safeContract = new Contract(address, GnosisSafeL2.abi, provider)
	const nonce = await safeContract.nonce()
	return nonce.toNumber()
}
