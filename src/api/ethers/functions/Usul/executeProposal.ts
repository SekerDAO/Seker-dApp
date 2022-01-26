import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {PrebuiltTx} from "../../../../types/common"
import Usul from "../../abis/Usul.json"
import {prebuiltTxToSafeTx, SafeTransaction} from "../gnosisSafe/safeUtils"

export const executeProposalSingle = async (
	usulAddress: string,
	proposalId: number,
	tx: SafeTransaction,
	signer: JsonRpcSigner
): Promise<string> => {
	const usul = new Contract(usulAddress, Usul.abi, signer)
	const transaction = await usul.executeProposalByIndex(
		proposalId,
		tx.to,
		tx.value,
		tx.data,
		tx.operation
	)
	await transaction.wait()
	return transaction.hash
}

export const executeProposalBatch = async (
	usulAddress: string,
	proposalId: number,
	transactions: PrebuiltTx[],
	signer: JsonRpcSigner
): Promise<void> => {
	const usulContract = new Contract(usulAddress, Usul.abi, signer)
	const targetTxs = await Promise.all(
		transactions.map(tx =>
			prebuiltTxToSafeTx(tx.address, tx.contractMethods, tx.selectedMethodIndex, tx.args)
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
