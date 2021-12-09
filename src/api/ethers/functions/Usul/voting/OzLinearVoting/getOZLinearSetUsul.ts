import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import config from "../../../../../../config"
import OZLinearVoting from "../../../../abis/OZLinearVoting.json"
import {buildContractCallVariable, SafeTransaction} from "../../../gnosisSafe/safeUtils"

const getOZLinearSetUsul = (
	expectedUsulAddress: string,
	expectedStrategyAddress: string,
	signer: JsonRpcSigner
): SafeTransaction => {
	const linearVotingMaster = new Contract(
		config.OZ_LINEAR_MASTER_ADDRESS,
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
