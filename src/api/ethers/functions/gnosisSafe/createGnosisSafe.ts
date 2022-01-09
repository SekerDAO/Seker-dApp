import {AddressZero} from "@ethersproject/constants"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import config from "../../../../config"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import GnosisSafeProxyFactory from "../../abis/GnosisSafeProxyFactory.json"
import {buildContractCall} from "./safeUtils"

const createGnosisSafe = async (
	admins: string[],
	votingThreshold: number,
	signer: JsonRpcSigner
): Promise<string> => {
	const factory = new Contract(
		config.GNOSIS_SAFE_PROXY_FACTORY_ADDRESS,
		GnosisSafeProxyFactory.abi,
		signer
	)
	const safeAddress = await factory.callStatic.createProxy(
		config.GNOSIS_SAFE_SINGLETON_ADDRESS,
		"0x"
	)
	const safe = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const safeSetupTx = buildContractCall(
		safe,
		"setup",
		[admins, votingThreshold, AddressZero, "0x", AddressZero, AddressZero, 0, AddressZero],
		0
	)
	const createProxyTx = await factory.createProxy(
		config.GNOSIS_SAFE_SINGLETON_ADDRESS,
		safeSetupTx.data
	)
	await createProxyTx.wait()
	return safeAddress
}

export default createGnosisSafe
