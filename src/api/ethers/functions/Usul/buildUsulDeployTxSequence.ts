import {BuiltVotingStrategy} from "../../../../types/DAO"
import {getRegisterModuleTx} from "../gnosisSafe/registerModule"
import {SafeTransaction} from "../gnosisSafe/safeUtils"
import getUsulDeploy from "./getUsulDeploy"
import getMemberLinearSetUsul from "./voting/MemberLinearVoting/getMemberLinearSetUsul"
import getMemberSingleSetUsul from "./voting/MemberSingleVoting/getMemberSingleSetUsul"
import getOZLinearSetUsul from "./voting/OzLinearVoting/getOZLinearSetUsul"
import getOZSingleSetUsul from "./voting/OzSingleVoting/getOZSingleSetUsul"

export const buildUsulDeployTxSequence = async (
	strategies: BuiltVotingStrategy[],
	gnosisAddress: string,
	sideChain: boolean
): Promise<{transactions: {tx: SafeTransaction; name: string}[]; expectedUsulAddress: string}> => {
	if (strategies.length === 0)
		return {
			transactions: [],
			expectedUsulAddress: ""
		}
	const {tx: deployUsulTx, expectedAddress: expectedUsulAddress} = getUsulDeploy(
		gnosisAddress,
		strategies.map(strategy => strategy.expectedAddress),
		sideChain
	)
	const setUsulTransactions = buildSetUsulTransactionsTxSequence(
		strategies,
		expectedUsulAddress,
		sideChain
	)
	const registerUsulTx = await getRegisterModuleTx(gnosisAddress, expectedUsulAddress)
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

export const buildSetUsulTransactionsTxSequence = (
	strategies: BuiltVotingStrategy[],
	usulAddress: string,
	sideChain: boolean
): {tx: SafeTransaction; name: string}[] =>
	strategies.map(strategy => {
		switch (strategy.strategy) {
			case "linearVoting":
				return {
					tx: getOZLinearSetUsul(usulAddress, strategy.expectedAddress, sideChain),
					name: "OzLinearSetUsul"
				}
			case "linearVotingSimpleMembership":
				return {
					tx: getMemberLinearSetUsul(usulAddress, strategy.expectedAddress, sideChain),
					name: "MembersLinearSetUsul"
				}
			case "singleVotingSimpleMembership":
				return {
					tx: getMemberSingleSetUsul(usulAddress, strategy.expectedAddress, sideChain),
					name: "MemberSingleSetUsul"
				}
			case "singleVoting":
				return {
					tx: getOZSingleSetUsul(usulAddress, strategy.expectedAddress, sideChain),
					name: "OzSingleSetUsul"
				}
			default:
				throw new Error("This strategy is not supported yet")
		}
	})
