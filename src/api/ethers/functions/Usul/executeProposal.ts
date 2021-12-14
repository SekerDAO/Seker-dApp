import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {PrebuiltTx} from "../../../../types/common"
import Usul from "../../abis/Usul.json"
import {buildProposalTx} from "./usulProposal"

export const executeProposalBatch = async (
	usulAddress: string,
	proposalId: number,
	transactions: PrebuiltTx[],
	signer: JsonRpcSigner
): Promise<void> => {
	const usulContract = new Contract(usulAddress, Usul.abi, signer)
	const targetTxs = transactions.map(tx =>
		buildProposalTx(tx.address, tx.contractMethods, tx.selectedMethodIndex, tx.args, signer)
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
