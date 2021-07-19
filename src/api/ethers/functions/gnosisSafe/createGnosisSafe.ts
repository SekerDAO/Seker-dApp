import {AddressZero} from "@ethersproject/constants"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import GnosisSafeProxyFactory from "../../abis/GnosisSafeProxyFactory.json"
import {Contract, ContractFactory} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
const {REACT_APP_PROXY_ADDRESS} = process.env

const createGnosisSafe = async (
	admins: string[],
	votingThreshold: number,
	signer: JsonRpcSigner
): Promise<string> => {
	const GnosisSafeL2Factory = new ContractFactory(GnosisSafeL2.abi, GnosisSafeL2.bytecode, signer)
	const singleton = await GnosisSafeL2Factory.deploy()
	const factory = new Contract(REACT_APP_PROXY_ADDRESS!, GnosisSafeProxyFactory.abi, signer)
	const template = await factory.callStatic.createProxy(singleton.address, "0x")
	const tx1 = await factory.createProxy(singleton.address, "0x")
	await tx1.wait()
	const safe = GnosisSafeL2Factory.attach(template)
	const tx2 = await safe.setup(
		admins,
		votingThreshold,
		AddressZero,
		"0x",
		AddressZero,
		AddressZero,
		0,
		AddressZero
	)
	await tx2.wait()
	return template
}

export default createGnosisSafe
