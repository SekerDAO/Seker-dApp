import {JsonRpcSigner} from "@ethersproject/providers"
import Seele from "../../abis/Seele.json"
import {createSafeSignature, executeSafeTx, SafeSignature} from "../gnosisSafe/safeUtils"

export const registerOZLinearVoting = async (
	gnosisAddress: string,
	seeleAddress: string,
	OZLinearVotingAddress: string,
	to: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> =>
	createSafeSignature(
		gnosisAddress,
		seeleAddress,
		Seele.abi,
		"enableStrategy",
		[OZLinearVotingAddress],
		signer
	)

export const executeRegisterOZStrategy = async (
	gnosisAddress: string,
	seeleAddress: string,
	OZLinearVotingAddress: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> =>
	executeSafeTx(
		gnosisAddress,
		seeleAddress,
		Seele.abi,
		"enableStrategy",
		[OZLinearVotingAddress],
		signer,
		signatures
	)
