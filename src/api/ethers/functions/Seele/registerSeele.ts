import {JsonRpcSigner} from "@ethersproject/providers"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import {createSafeSignature, executeSafeTx, SafeSignature} from "../gnosisSafe/safeUtils"

export const signRegisterSeele = async (
	gnosisAddress: string,
	seeleAddress: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> =>
	createSafeSignature(
		gnosisAddress,
		gnosisAddress,
		GnosisSafeL2.abi,
		"enableModule",
		[seeleAddress],
		signer
	)

export const executeRegisterSeele = async (
	gnosisAddress: string,
	seeleAddress: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> =>
	executeSafeTx(
		gnosisAddress,
		gnosisAddress,
		GnosisSafeL2.abi,
		"enableModule",
		[seeleAddress],
		signer,
		signatures
	)
