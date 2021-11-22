import {JsonRpcSigner} from "@ethersproject/providers"
import Usul from "../../abis/Usul.json"
import OZLinearVoting from "../../abis/OZLinearVoting.json"
import {Contract} from "@ethersproject/contracts"
import {SafeTransaction} from "../gnosisSafe/safeUtils"

export const getStrategiesAddresses = async (
	usulAddress: string,
	signer: JsonRpcSigner
): Promise<string[]> => {
	const usulProxy = new Contract(usulAddress, Usul.abi, signer)
	return usulProxy.getStrategiesPaginated("0x0000000000000000000000000000000000000001", 10)
}

export const inspectStrategy = async (
	strategyAddress: string,
	signer: JsonRpcSigner
): Promise<string> => {
	const strategy = new Contract(strategyAddress, OZLinearVoting.abi, signer)
	return strategy.name()
}

export const generateTxHashes = async (
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
	txHashes: SafeTransaction[],
	signer: JsonRpcSigner,
	extraData = "0x"
): Promise<void> => {
	const usulProxy = new Contract(usulAddress, Usul.abi, signer)
	await usulProxy.submitProposal(txHashes, strategyAddress, extraData)
}
