import {defaultAbiCoder} from "@ethersproject/abi"
import {getCreate2Address} from "@ethersproject/address"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {keccak256} from "@ethersproject/solidity"
import ModuleFactory from "../../../../abis/ModuleFactory.json"
import OZLinearVoting from "../../../../abis/OZLinearVoting.json"
import {buildContractCall, SafeTransaction} from "../../../gnosisSafe/safeUtils"

const {REACT_APP_MODULE_FACTORY_ADDRESS, REACT_APP_OZ_LINEAR_MASTER_ADDRESS} = process.env

const getOZLinearDeployTx = (
	safeAddress: string,
	governanceToken: string,
	quorumThreshold: number,
	delay: number,
	votingPeriod: number,
	signer: JsonRpcSigner
): {tx: SafeTransaction; expectedAddress: string} => {
	const linearVotingMaster = new Contract(
		REACT_APP_OZ_LINEAR_MASTER_ADDRESS!,
		OZLinearVoting.abi,
		signer
	)
	const factory = new Contract(REACT_APP_MODULE_FACTORY_ADDRESS!, ModuleFactory.abi, signer)
	const encodedLinearInitParams = defaultAbiCoder.encode(
		["address", "address", "address", "uint256", "uint256", "uint256", "string"],
		[
			safeAddress, // owner
			governanceToken,
			"0x0000000000000000000000000000000000000001",
			votingPeriod,
			quorumThreshold, // number of votes wieghted to pass
			delay, // number of days proposals are active
			"linearVoting"
		]
	)
	const initLinearData = linearVotingMaster.interface.encodeFunctionData("setUp", [
		encodedLinearInitParams
	])
	const masterLinearCopyAddress = linearVotingMaster.address.toLowerCase().replace(/^0x/, "")
	const byteCodeLinear =
		"0x602d8060093d393df3363d3d373d3d3d363d73" +
		masterLinearCopyAddress +
		"5af43d82803e903d91602b57fd5bf3"
	const saltLinear = keccak256(
		["bytes32", "uint256"],
		[keccak256(["bytes"], [initLinearData]), "0x01"]
	)
	const expectedAddress = getCreate2Address(
		factory.address,
		saltLinear,
		keccak256(["bytes"], [byteCodeLinear])
	)
	const deployLinear = buildContractCall(
		factory,
		"deployModule",
		[linearVotingMaster.address, initLinearData, "0x01"],
		0
	)
	return {tx: deployLinear, expectedAddress}
}

export default getOZLinearDeployTx
