import {Contract} from "@ethersproject/contracts"
import config from "../../../../../../config"
import MemberSingleVoting from "../../../../abis/SimpleMemberVoting.json"
import {buildContractCallVariable, SafeTransaction} from "../../../gnosisSafe/safeUtils"

const getMemberSingleSetUsul = (
	usulAddress: string,
	strategyAddress: string,
	sideChain = false
): SafeTransaction => {
	const votingMaster = new Contract(
		sideChain
			? config.SIDE_CHAIN_MEMBER_SINGLE_MASTER_ADDRESS
			: config.MEMBER_SINGLE_MASTER_ADDRESS,
		MemberSingleVoting.abi
	)
	return buildContractCallVariable(votingMaster, strategyAddress, "setUsul", [usulAddress], 0)
}

export default getMemberSingleSetUsul
