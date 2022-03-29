import {defaultAbiCoder} from "@ethersproject/abi"
import {getCreate2Address} from "@ethersproject/address"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {keccak256} from "@ethersproject/solidity"
import config from "../../../../../../config"
import ModuleFactory from "../../../../abis/ModuleFactory.json"
import MemberSingleVoting from "../../../../abis/SimpleMemberVoting.json"
import {buildContractCall, SafeTransaction} from "../../../gnosisSafe/safeUtils"

// TODO: pass usul, probably fix and abstract for various strats
const getMemberSingleDeployTx = async (
	safeAddress: string,
	quorumThreshold: number,
	delay: number,
	votingPeriod: number,
	members: string[],
	signer: JsonRpcSigner,
	sideChain = false
): Promise<{tx: SafeTransaction; expectedAddress: string}> => {
	const votingMaster = new Contract(
		sideChain
			? config.SIDE_CHAIN_MEMBER_SINGLE_MASTER_ADDRESS
			: config.MEMBER_SINGLE_MASTER_ADDRESS,
		MemberSingleVoting.abi,
		signer
	)
	const factory = new Contract(
		sideChain ? config.SIDE_CHAIN_MODULE_FACTORY_ADDRESS : config.MODULE_FACTORY_ADDRESS,
		ModuleFactory.abi,
		signer
	)
	const encodedInitParams = defaultAbiCoder.encode(
		["address", "address", "uint256", "uint256", "uint256", "string", "address[]"],
		[
			safeAddress, // owner
			"0x0000000000000000000000000000000000000001",
			votingPeriod,
			quorumThreshold, // number of votes weighted to pass
			delay, // number of days proposals are active
			"singleVotingSimpleMembership",
			members
		]
	)
	const initData = votingMaster.interface.encodeFunctionData("setUp", [encodedInitParams])
	const masterCopyAddress = votingMaster.address.toLowerCase().replace(/^0x/, "")
	const byteCodeLinear =
		"0x602d8060093d393df3363d3d373d3d3d363d73" +
		masterCopyAddress +
		"5af43d82803e903d91602b57fd5bf3"
	const salt = keccak256(["bytes32", "uint256"], [keccak256(["bytes"], [initData]), "0x01"])
	const expectedAddress = getCreate2Address(
		factory.address,
		salt,
		keccak256(["bytes"], [byteCodeLinear])
	)
	const tx = buildContractCall(factory, "deployModule", [votingMaster.address, initData, "0x01"], 0)
	return {tx, expectedAddress}
}

export default getMemberSingleDeployTx
