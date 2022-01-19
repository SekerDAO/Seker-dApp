import {BigNumber} from "@ethersproject/bignumber"
import {hexZeroPad} from "@ethersproject/bytes"
import {ContractFactory} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import config from "../../../../config"
import AMBModule from "../../abis/AMBModule.json"

const deployBridge = async (
	gnosisAddress: string,
	sideGnosisAddress: string,
	signer: JsonRpcSigner
): Promise<string> => {
	const factory = new ContractFactory(AMBModule.abi, AMBModule.bytecode, signer)
	const contract = await factory.deploy(
		gnosisAddress,
		gnosisAddress,
		gnosisAddress,
		config.AMB_ADDRESS,
		sideGnosisAddress,
		hexZeroPad(BigNumber.from(config.SIDE_CHAIN_ID).toHexString(), 32)
	)
	return contract.address
}

export default deployBridge
