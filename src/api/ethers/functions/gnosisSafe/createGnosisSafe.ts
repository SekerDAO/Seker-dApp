import {AddressZero} from "@ethersproject/constants"
import GnosisSafeL2 from "../../abis/GnosisSafeL2.json"
import GnosisSafeProxyFactory from "../../abis/GnosisSafeProxyFactory.json"
import {Contract, ContractFactory} from "@ethersproject/contracts"
import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
const {REACT_APP_PROXY_ADDRESS} = process.env

const createGnosisSafe = async (
	admins: string[],
	votingThreshold: number,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<string> =>
	new Promise(async (resolve, reject) => {
		try {
			const GnosisSafeL2Factory = new ContractFactory(
				GnosisSafeL2.abi,
				GnosisSafeL2.bytecode,
				signer
			)
			const singleton = await GnosisSafeL2Factory.deploy()
			const factory = new Contract(REACT_APP_PROXY_ADDRESS!, GnosisSafeProxyFactory.abi, provider)
			const template = await factory.callStatic.createProxy(singleton.address, "0x")
			const safe = GnosisSafeL2Factory.attach(template)
			const tx = await safe.setup(
				admins,
				votingThreshold,
				AddressZero,
				"0x",
				AddressZero,
				AddressZero,
				0,
				AddressZero
			)

			provider.once(tx.hash, () => {
				resolve(singleton.address)
			})
		} catch (e) {
			reject(e)
		}
	})

export default createGnosisSafe
