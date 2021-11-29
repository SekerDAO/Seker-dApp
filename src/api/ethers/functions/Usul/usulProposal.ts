import {Contract, ContractInterface} from "@ethersproject/contracts"
import {JsonRpcProvider, JsonRpcSigner} from "@ethersproject/providers"
import Usul from "../../abis/Usul.json"
import {buildContractCall, SafeTransaction} from "../gnosisSafe/safeUtils"

const generateTxHashes = async (
	usulAddress: string,
	transactions: SafeTransaction[],
	signer: JsonRpcSigner
): Promise<string[]> => {
	const usulProxy = new Contract(usulAddress, Usul.abi, signer)
	return Promise.all(
		transactions.map(
			async (tx): Promise<string> =>
				usulProxy.getTransactionHash(tx.to, tx.value, tx.data, tx.operation)
		)
	)
}

export const submitProposal = async (
	usulAddress: string,
	strategyAddress: string,
	transactions: SafeTransaction[],
	signer: JsonRpcSigner,
	extraData = "0x"
): Promise<void> => {
	const usulProxy = new Contract(usulAddress, Usul.abi, signer)
	const hashes = await generateTxHashes(usulAddress, transactions, signer)
	await usulProxy.submitProposal(hashes, strategyAddress, extraData)
}

export const buildProposalTx = async (
	contractAddress: string,
	contractAbi: ContractInterface,
	method: string,
	args: unknown[],
	provider: JsonRpcProvider
): Promise<SafeTransaction> => {
	const contract = new Contract(contractAddress, contractAbi, provider)
	return buildContractCall(contract, method, args, 0)
}
