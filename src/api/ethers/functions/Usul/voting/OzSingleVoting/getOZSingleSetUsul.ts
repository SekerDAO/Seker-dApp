import {Contract} from "@ethersproject/contracts"
import config from "../../../../../../config"
import OZSingleVoting from "../../../../abis/OZSingleVoting.json"
import {buildContractCallVariable, SafeTransaction} from "../../../gnosisSafe/safeUtils"

const getOZSingleSetUsul = (
	usulAddress: string,
	strategyAddress: string,
	sideChain = false
): SafeTransaction => {
	const votingMaster = new Contract(
		sideChain ? config.SIDE_CHAIN_OZ_SINGLE_MASTER_ADDRESS : config.OZ_SINGLE_MASTER_ADDRESS,
		OZSingleVoting.abi
	)
	return buildContractCallVariable(votingMaster, strategyAddress, "setUsul", [usulAddress], 0)
}

export default getOZSingleSetUsul
