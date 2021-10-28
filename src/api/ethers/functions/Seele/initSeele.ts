import Seele from "../../abis/Seele.json"
import ModuleFactory from "../../abis/ModuleFactory.json"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import {defaultAbiCoder} from "@ethersproject/abi"
import {keccak256} from "@ethersproject/solidity"
import {getCreate2Address} from "@ethersproject/address"
const {REACT_APP_SEELE_MASTERCOPY_ADDRESS, REACT_APP_MODULE_FACTORY_ADDRESS} = process.env

const initSeele = async (
	safeAddress: string,
	strategyAddresses: string[],
	signer: JsonRpcSigner
): Promise<string> =>
	new Promise(async (resolve, reject) => {
		try {
			const seeleMaster = new Contract(REACT_APP_SEELE_MASTERCOPY_ADDRESS!, Seele.abi, signer)
			const factory = new Contract(REACT_APP_MODULE_FACTORY_ADDRESS!, ModuleFactory.abi, signer)
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
			const expectedAddress = getCreate2Address(
				factory.address,
				salt,
				keccak256(["bytes"], [byteCode])
			)

			factory.once("ModuleProxyCreation", (realAddress: string) => {
				if (realAddress.toLowerCase() !== expectedAddress.toLowerCase()) {
					reject(new Error("Real address does not match the expected one"))
				}
				resolve(realAddress.toLowerCase())
			})

			await factory.deployModule(seeleMaster.address, initData, "0x01")
		} catch (e) {
			reject(e)
		}
	})

export default initSeele
