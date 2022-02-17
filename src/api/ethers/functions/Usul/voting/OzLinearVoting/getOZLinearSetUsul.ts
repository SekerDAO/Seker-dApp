import {Contract} from "@ethersproject/contracts"
import config from "../../../../../../config"
import OZLinearVoting from "../../../../abis/OZLinearVoting.json"
import {buildContractCallVariable, SafeTransaction} from "../../../gnosisSafe/safeUtils"

const getOZLinearSetUsul = (
	usulAddress: string,
	strategyAddress: string,
	sideChain = false
): SafeTransaction => {
	const linearVotingMaster = new Contract(
		sideChain ? config.SIDE_CHAIN_OZ_LINEAR_MASTER_ADDRESS : config.OZ_LINEAR_MASTER_ADDRESS,
		OZLinearVoting.abi
	)
	return buildContractCallVariable(linearVotingMaster, strategyAddress, "setUsul", [usulAddress], 0)
}

export default getOZLinearSetUsul
