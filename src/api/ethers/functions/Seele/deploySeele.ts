import Seele from "../../abis/Seele.json"
import ModuleFactory from "../../abis/ModuleFactory.json"
import {ContractFactory, Contract} from "@ethersproject/contracts"
import {JsonRpcSigner, JsonRpcProvider} from "@ethersproject/providers"
import {parseEther} from "@ethersproject/units"
import {defaultAbiCoder} from "@ethersproject/abi"
import {utils} from "ethers"
import {keccak256} from "@ethersproject/solidity"
import {getCreate2Address} from "@ethersproject/address"

// TODO const {SEELE_MASTERCOPY_ADDRESS} = process.env
// TODO const {MODULE_FACTORY_ADDRESS} = process.env
const seeleMasterCopy = "0x55E2E610cd64DABcE4C02C40AAf711AE02b52fcf"
const moduleFactory = "0xb113d1D1bB1bF3B51418B1de9D29b1aaA7Df1007"

const deploySeele = async (
	safeAddress: string,
	strategyAddresses: string[],
	signer: JsonRpcSigner,
	provider: JsonRpcProvider
): Promise<string> => {
	const seeleMaster = new Contract(seeleMasterCopy, Seele.abi, provider)
	const factory = new Contract(moduleFactory, ModuleFactory.abi, signer)
	const encodedInitParams = defaultAbiCoder.encode(
		["address", "address", "address", "address[]"],
		[safeAddress, safeAddress, safeAddress, strategyAddresses]
	)
	const initData = seeleMaster.interface.encodeFunctionData("setUp", [encodedInitParams])
	const masterCopyAddress = seeleMaster.address.toLowerCase().replace(/^0x/, "")
	const byteCode =
		"0x602d8060093d393df3363d3d373d3d3d363d73" +
		masterCopyAddress +
		"5af43d82803e903d91602b57fd5bf3"
	const salt = keccak256(["bytes32", "uint256"], [keccak256(["bytes"], [initData]), "0x01"])
	const expectedAddress = getCreate2Address(factory.address, salt, keccak256(["bytes"], [byteCode]))
	const tx = await factory.deployModule(seeleMaster.address, initData, "0x01")
	await tx.wait()
	// TODO: Can grab the first event arg and be sure it matches expectedAddress
	return expectedAddress
}

export default deploySeele
