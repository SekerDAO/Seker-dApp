import {JsonRpcSigner} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import ProposalModule from "../../abis/ProposalModule.json"
import {
	buildContractCall,
	executeSafeTx,
	SafeSignature,
	safeSignMessage
} from "../gnosisSafe/safeUtils"

export const signHookupLinearVotingModule = async (
	safeAddress: string,
	votingAddress: string,
	proposalModule: string,
	signer: JsonRpcSigner
): Promise<SafeSignature> => {
	const safeContract = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const proposalContract = new Contract(proposalModule, ProposalModule.abi, signer)
	const nonce = await safeContract.nonce()
	const call = buildContractCall(proposalContract, "enableModule", [votingAddress], nonce.add(1))
	return safeSignMessage(signer, safeContract, call)
}

export const executeHookupLinearVotingModule = async (
	safeAddress: string,
	votingAddress: string,
	proposalModule: string,
	signatures: SafeSignature[],
	signer: JsonRpcSigner
): Promise<void> =>
	executeSafeTx(
		safeAddress,
		proposalModule,
		ProposalModule.abi,
		"enableModule",
		[votingAddress],
		signer,
		signatures
	)
