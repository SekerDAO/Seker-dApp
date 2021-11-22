import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "./safeUtils"
const SENTINEL_OWNER = "0x0000000000000000000000000000000000000001"

export const signAddOwner = async (
	safeAddress: string,
	adminAddress: string,
	newThreshold: number,
	signer: JsonRpcSigner
): Promise<[SafeSignature, number]> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(
		safeContract,
		"addOwnerWithThreshold",
		[adminAddress, newThreshold],
		nonce
	)
	return [await safeSignMessage(signer, safeContract, call), nonce.toNumber()]
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

export const signRemoveOwner = async (
	safeAddress: string,
	adminAddress: string,
	newThreshold: number,
	signer: JsonRpcSigner
): Promise<[SafeSignature, number]> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const owners: string[] = await safeContract.getOwners()

	if (owners.length === 1) {
		// TODO: handle burn
		throw new Error("Cannot remove the only owner")
	}
	if (newThreshold > owners.length - 1 || newThreshold < 1) {
		throw new Error("Bad threshold")
	}
	const ownerIndex = await owners.findIndex(
		owner => owner.toLowerCase() === adminAddress.toLowerCase()
	)
	if (ownerIndex === -1) {
		throw new Error("Owner not found")
	}

	const call = buildContractCall(
		safeContract,
		"removeOwner",
		[ownerIndex === 0 ? SENTINEL_OWNER : owners[ownerIndex - 1], adminAddress, newThreshold],
		nonce
	)
	return [await safeSignMessage(signer, safeContract, call), nonce.toNumber()]
}

export const executeRemoveOwner = async (
	safeAddress: string,
	adminAddress: string,
	newThreshold: number,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const nonce = await safeContract.nonce()
	const owners: string[] = await safeContract.getOwners()

	if (owners.length === 1) {
		// TODO: handle burn
		throw new Error("Cannot remove the only owner")
	}
	if (newThreshold > owners.length - 1 || newThreshold < 1) {
		throw new Error("Bad threshold")
	}
	const ownerIndex = await owners.findIndex(
		owner => owner.toLowerCase() === adminAddress.toLowerCase()
	)
	if (ownerIndex === -1) {
		throw new Error("Owner not found")
	}

	const call = buildContractCall(
		safeContract,
		"removeOwner",
		[ownerIndex === 0 ? SENTINEL_OWNER : owners[ownerIndex - 1], adminAddress, newThreshold],
		nonce
	)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
