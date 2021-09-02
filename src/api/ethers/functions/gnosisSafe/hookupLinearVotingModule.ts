import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import ProposalModule from "../../abis/ProposalModule.json"
import {buildContractCall, executeTx, SafeSignature, safeSignMessage} from "./safeUtils"

export const signHookupLinearVotingModule = async (
	safeAddress: string,
	votingAddress: string,
	proposalModule: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const proposalContract = new Contract(proposalModule, ProposalModule.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(proposalContract, "enableModule", [votingAddress], nonce)
	return safeSignMessage(signer, proposalContract, call)
}

export const executeHookupLinearVotingModule = async (
	safeAddress: string,
	votingAddress: string,
	proposalModule: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const proposalContract = new Contract(proposalModule, ProposalModule.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(proposalContract, "enableModule", [votingAddress], nonce)
	const tx = await executeTx(safeContract, call, signatures)
	await tx.wait()
}
