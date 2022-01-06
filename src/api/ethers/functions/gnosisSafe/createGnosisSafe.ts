import {AddressZero} from "@ethersproject/constants"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import config from "../../../../config"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import GnosisSafeProxyFactory from "../../abis/GnosisSafeProxyFactory.json"

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
	const createProxyTx = await factory.createProxy(config.GNOSIS_SAFE_SINGLETON_ADDRESS, "0x")
	await createProxyTx.wait()
	const safe = new Contract(safeAddress, GnosisSafeL2.abi, signer)
	const safeSetupTx = await safe.setup(
		admins,
		votingThreshold,
		AddressZero,
		"0x",
		AddressZero,
		AddressZero,
		0,
		AddressZero
	)
	await safeSetupTx.wait()
	return safeAddress
}

export default createGnosisSafe
