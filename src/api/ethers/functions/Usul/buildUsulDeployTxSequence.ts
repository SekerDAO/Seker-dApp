import {JsonRpcSigner} from "@ethersproject/providers"
import {BuiltVotingStrategy} from "../../../../types/DAO"
import {getRegisterModuleTx} from "../gnosisSafe/registerModule"
import {SafeTransaction} from "../gnosisSafe/safeUtils"
import getUsulDeploy from "./getUsulDeploy"
import getOZLinearSetUsul from "./voting/OzLinearVoting/getOZLinearSetUsul"

const buildUsulDeployTxSequence = async (
	strategies: BuiltVotingStrategy[],
	gnosisAddress: string,
	signer: JsonRpcSigner,
	sideChain = false
): Promise<{transactions: {tx: SafeTransaction; name: string}[]; expectedUsulAddress: string}> => {
	if (strategies.length === 0)
		return {
			transactions: [],
			expectedUsulAddress: ""
		}
	const {tx: deployUsulTx, expectedAddress: expectedUsulAddress} = getUsulDeploy(
		gnosisAddress,
		strategies.map(strategy => strategy.expectedAddress),
		signer,
		sideChain
	)
	const setUsulTransactions = strategies.map(strategy => {
		switch (strategy.strategy) {
			case "linearVoting":
				return {
					tx: getOZLinearSetUsul(expectedUsulAddress, strategy.expectedAddress, signer, sideChain),
					name: "OzLinearSetUsul"
				}
			default:
				throw new Error("This strategy is not supported yet")
		}
	})
	const registerUsulTx = await getRegisterModuleTx(
		gnosisAddress,
		expectedUsulAddress,
		signer,
		sideChain
	)
	return {
		transactions: [
			...strategies.map(strategy => ({tx: strategy.tx, name: strategy.strategy})),
			{tx: deployUsulTx, name: "deployUsul"},
			...setUsulTransactions,
			{tx: registerUsulTx, name: "registerUsul"}
		],
		expectedUsulAddress
	}
}

export default buildUsulDeployTxSequence
