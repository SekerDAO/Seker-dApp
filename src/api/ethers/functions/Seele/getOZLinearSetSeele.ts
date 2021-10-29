import {JsonRpcSigner} from "@ethersproject/providers"
import OZLinearVoting from "../../abis/OZLinearVoting.json"
import {Contract} from "@ethersproject/contracts"
import {buildContractCallVariable, SafeTransaction} from "../gnosisSafe/safeUtils"
const {REACT_APP_OZ_LINEAR_MASTER_ADDRESS} = process.env

const getOZLinearSetSeele = async (
	expectedSeeleAddress: string,
	expectedStrategyAddress: string,
	signer: JsonRpcSigner
): Promise<SafeTransaction> => {
	const linearVotingMaster = new Contract(
		REACT_APP_OZ_LINEAR_MASTER_ADDRESS!,
		OZLinearVoting.bytecode,
		signer
	)
	return buildContractCallVariable(
		linearVotingMaster,
		expectedStrategyAddress,
		"setSeele",
		[expectedSeeleAddress],
		0
	)
}

export default getOZLinearSetSeele
