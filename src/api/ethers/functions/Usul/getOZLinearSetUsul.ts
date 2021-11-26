import OZLinearVoting from "../../abis/OZLinearVoting.json"
import {buildContractCallVariable, SafeTransaction} from "../gnosisSafe/safeUtils"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"

const {REACT_APP_OZ_LINEAR_MASTER_ADDRESS} = process.env

const getOZLinearSetUsul = (
	expectedUsulAddress: string,
	expectedStrategyAddress: string,
	signer: JsonRpcSigner
): SafeTransaction => {
	const linearVotingMaster = new Contract(
		REACT_APP_OZ_LINEAR_MASTER_ADDRESS!,
		OZLinearVoting.abi,
		signer
	)
	return buildContractCallVariable(
		linearVotingMaster,
		expectedStrategyAddress,
		"setUsul",
		[expectedUsulAddress],
		0
	)
}

export default getOZLinearSetUsul
