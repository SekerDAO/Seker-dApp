import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {AbiFunction} from "../../../../types/abi"
import {PrebuiltTx} from "../../../../types/common"
import Usul from "../../abis/Usul.json"
import {buildProposalTx} from "./usulProposal"

export const executeProposal = async (
	usulAddress: string,
	proposalId: number,
	targetAddress: string,
	targetAbi: AbiFunction[],
	targetMethod: string,
	args: unknown[],
	signer: JsonRpcSigner
): Promise<void> => {
	const usulContract = new Contract(usulAddress, Usul.abi, signer)
	const targetTx = buildProposalTx(targetAddress, targetAbi, targetMethod, args, signer)
	const tx = await usulContract.executeProposalByIndex(
		proposalId,
		targetAddress,
		targetTx.value,
		targetTx.data,
		targetTx.operation
	)
	await tx.wait()
}

export const executeProposalBatch = async (
	usulAddress: string,
	proposalId: number,
	transactions: PrebuiltTx[],
	signer: JsonRpcSigner
): Promise<void> => {
	const usulContract = new Contract(usulAddress, Usul.abi, signer)
	const targetTxs = transactions.map(tx =>
		buildProposalTx(
			tx.address,
			tx.contractMethods,
			tx.contractMethods[tx.selectedMethodIndex].name,
			tx.args,
			signer
		)
	)
	const transaction = await usulContract.executeProposalBatch(
		proposalId,
		targetTxs.map(tx => tx.to),
		targetTxs.map(tx => tx.value),
		targetTxs.map(tx => tx.data),
		targetTxs.map(tx => tx.operation)
	)
	await transaction.wait()
}
