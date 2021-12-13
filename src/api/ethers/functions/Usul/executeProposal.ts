import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {AbiFunction} from "../../../../types/abi"
import Usul from "../../abis/Usul.json"
import {buildProposalTx} from "./usulProposal"

const executeProposal = async (
	usulAddress: string,
	proposalId: number,
	targetAddress: string,
	targetAbi: AbiFunction[],
	targetMethod: string,
	args: unknown[],
	signer: JsonRpcSigner
): Promise<void> => {
	const usulContract = new Contract(usulAddress, Usul.abi, signer)
	const targetTx = await buildProposalTx(targetAddress, targetAbi, targetMethod, args, signer)
	const tx = await usulContract.executeProposalByIndex(
		proposalId,
		targetAddress,
		targetTx.value,
		targetTx.data,
		targetTx.operation
	)
	await tx.wait()
}

export default executeProposal
