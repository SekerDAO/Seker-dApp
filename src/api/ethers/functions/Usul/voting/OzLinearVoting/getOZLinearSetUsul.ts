import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import config from "../../../../../../config"
import OZLinearVoting from "../../../../abis/OZLinearVoting.json"
import {buildContractCallVariable, SafeTransaction} from "../../../gnosisSafe/safeUtils"

const getOZLinearSetUsul = (
	expectedUsulAddress: string,
	expectedStrategyAddress: string,
	signer: JsonRpcSigner,
	sideChain = false
): SafeTransaction => {
	const linearVotingMaster = new Contract(
		sideChain ? config.SIDE_CHAIN_OZ_LINEAR_MASTER_ADDRESS : config.OZ_LINEAR_MASTER_ADDRESS,
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
