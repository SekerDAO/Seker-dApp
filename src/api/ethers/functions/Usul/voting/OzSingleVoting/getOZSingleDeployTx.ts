import {defaultAbiCoder} from "@ethersproject/abi"
import {getCreate2Address} from "@ethersproject/address"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {keccak256} from "@ethersproject/solidity"
import config from "../../../../../../config"
import ModuleFactory from "../../../../abis/ModuleFactory.json"
import OZSingleVoting from "../../../../abis/OZSingleVoting.json"
import {buildContractCall, SafeTransaction} from "../../../gnosisSafe/safeUtils"

const getOZSingleDeployTx = async (
	safeAddress: string,
	governanceToken: string,
	quorumThreshold: number,
	delay: number,
	votingPeriod: number,
	signer: JsonRpcSigner,
	sideChain = false
): Promise<{tx: SafeTransaction; expectedAddress: string}> => {
	const votingMaster = new Contract(
		sideChain ? config.SIDE_CHAIN_OZ_SINGLE_MASTER_ADDRESS : config.OZ_SINGLE_MASTER_ADDRESS,
		OZSingleVoting.abi,
		signer
	)
	const factory = new Contract(
		sideChain ? config.SIDE_CHAIN_MODULE_FACTORY_ADDRESS : config.MODULE_FACTORY_ADDRESS,
		ModuleFactory.abi,
		signer
	)
	const encodedInitParams = defaultAbiCoder.encode(
		["address", "address", "address", "uint256", "uint256", "uint256", "string"],
		[
			safeAddress, // owner
			governanceToken,
			"0x0000000000000000000000000000000000000001",
			votingPeriod,
			quorumThreshold, // number of votes wieghted to pass
			delay, // number of days proposals are active
			"singleVoting"
		]
	)
	const initData = votingMaster.interface.encodeFunctionData("setUp", [encodedInitParams])
	const masterCopyAddress = votingMaster.address.toLowerCase().replace(/^0x/, "")
	const byteCode =
		"0x602d8060093d393df3363d3d373d3d3d363d73" +
		masterCopyAddress +
		"5af43d82803e903d91602b57fd5bf3"
	const salt = keccak256(["bytes32", "uint256"], [keccak256(["bytes"], [initData]), "0x01"])
	const expectedAddress = getCreate2Address(factory.address, salt, keccak256(["bytes"], [byteCode]))
	const tx = buildContractCall(factory, "deployModule", [votingMaster.address, initData, "0x01"], 0)
	return {tx, expectedAddress}
}

export default getOZSingleDeployTx
