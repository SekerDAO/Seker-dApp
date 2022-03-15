import {Contract} from "@ethersproject/contracts"
import config from "../../../../../../config"
import MemberLinearVoting from "../../../../abis/MemberLinearVoting.json"
import {buildContractCallVariable, SafeTransaction} from "../../../gnosisSafe/safeUtils"

const getMemberLinearSetUsul = (
	usulAddress: string,
	strategyAddress: string,
	sideChain = false
): SafeTransaction => {
	const votingMaster = new Contract(
		sideChain
			? config.SIDE_CHAIN_MEMBER_LINEAR_MASTER_ADDRESS
			: config.MEMBER_LINEAR_MASTER_ADDRESS,
		MemberLinearVoting.abi
	)
	return buildContractCallVariable(votingMaster, strategyAddress, "setUsul", [usulAddress], 0)
}

export default getMemberLinearSetUsul
