import {JsonRpcSigner} from "@ethersproject/providers"
import {BuiltVotingStrategy} from "../../../../types/DAO"
import {SafeTransaction} from "../gnosisSafe/safeUtils"
import getRegisterUsulTx from "./getRegisterUsulTx"
import getUsulDeploy from "./getUsulDeploy"
import getOZLinearSetUsul from "./voting/OzLinearVoting/getOZLinearSetUsul"

const buildUsulDeployTxSequence = async (
	strategies: BuiltVotingStrategy[],
	gnosisAddress: string,
	signer: JsonRpcSigner
): Promise<{transactions: {tx: SafeTransaction; name: string}[]; expectedUsulAddress: string}> => {
	if (strategies.length === 0)
		return {
			transactions: [],
			expectedUsulAddress: ""
		}
	const {tx: deployUsulTx, expectedAddress: expectedUsulAddress} = getUsulDeploy(
		gnosisAddress,
		strategies.map(strategy => strategy.expectedAddress),
		signer
	)
	const setUsulTransactions = strategies.map(strategy => {
		switch (strategy.strategy) {
			case "linearVoting":
				return {
					tx: getOZLinearSetUsul(expectedUsulAddress, strategy.expectedAddress, signer),
					name: "OzLinearSetUsul"
				}
			default:
				throw new Error("This strategy is not supported yet")
		}
	})
	const registerUsulTx = await getRegisterUsulTx(gnosisAddress, expectedUsulAddress, signer)
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
