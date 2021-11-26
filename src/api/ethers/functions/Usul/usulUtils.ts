import {VotingStrategy} from "../../../../types/DAO"
import OZLinearVoting from "../../abis/OZLinearVoting.json"
import Usul from "../../abis/Usul.json"
import {SafeTransaction} from "../gnosisSafe/safeUtils"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcProvider, JsonRpcSigner} from "@ethersproject/providers"

export const getStrategies = async (
	usulAddress: string,
	provider: JsonRpcProvider
): Promise<VotingStrategy[]> => {
	const usulProxy = new Contract(usulAddress, Usul.abi, provider)
	const addresses = await usulProxy.getStrategiesPaginated(
		"0x0000000000000000000000000000000000000001",
		10
	)
	return Promise.all(
		addresses[0].map(async (address: string) => inspectStrategy(address, provider))
	)
}

export const inspectStrategy = async (
	strategyAddress: string,
	provider: JsonRpcProvider
): Promise<string> => {
	const strategy = new Contract(strategyAddress, OZLinearVoting.abi, provider)
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
