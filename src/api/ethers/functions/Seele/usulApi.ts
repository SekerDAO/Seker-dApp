import {JsonRpcSigner} from "@ethersproject/providers"
import Seele from "../../abis/Seele.json"
import OZLinearVoting from "../../abis/OZLinearVoting.json"
import {Contract} from "@ethersproject/contracts"
import {buildContractCall, SafeTransaction} from "../gnosisSafe/safeUtils"

export const getStrategies = async (
	usulAddress: string,
	signer: JsonRpcSigner
): Promise<string[]> => {
	const usulProxy = new Contract(usulAddress, Seele.abi, signer)
	const strategies: string[] = await usulProxy.getStrategiesPaginated(
		"0x0000000000000000000000000000000000000001",
		10
	)
	console.log(strategies[0])
	return strategies
}

export const inspectStrategy = async (strategy: string, signer: JsonRpcSigner): Promise<string> => {
	const Strategy = new Contract(strategy, OZLinearVoting.abi, signer)
	const name = await Strategy.name()
	return name
}

export const generateTxHashes = async (
	usulAddress: string,
	transactions: SafeTransaction[],
	signer: JsonRpcSigner
): Promise<string[]> => {
	const usulProxy = new Contract(usulAddress, Seele.abi, signer)
	const txHashes: string[] = await Promise.all(
		transactions.map(async (tx): Promise<string> => {
			return await usulProxy.getTransactionHash(tx.to, tx.value, tx.data, tx.operation)
		})
	)
	return txHashes
}

export const submitProposal = async (
	usulAddress: string,
	strategyAddress: string,
	txHashes: SafeTransaction[],
	signer: JsonRpcSigner,
	extraData = "0x"
): Promise<void> => {
	const usulProxy = new Contract(usulAddress, Seele.abi, signer)
	await usulProxy.submitProposal(txHashes, strategyAddress, extraData)
}
