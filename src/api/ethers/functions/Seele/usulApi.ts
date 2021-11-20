import {JsonRpcSigner} from "@ethersproject/providers"
import Seele from "../../abis/Seele.json"
import OZLinearVoting from "../../abis/OZLinearVoting.json"
import {Contract} from "@ethersproject/contracts"
import {buildContractCall, SafeTransaction} from "../gnosisSafe/safeUtils"

export const getStrategies = async (
	usulAddress: string,
	signer: JsonRpcSigner
): Promise<string[]> => {
	const usulProxy = new Contract(usulAddress, Seele.abi, signer)
	console.log(usulAddress)
	const strategies: string[] = await usulProxy.getStrategiesPaginated(
		"0x0000000000000000000000000000000000000001",
		10
	)
	console.log(strategies[0])
	return strategies
}

export const inspectStrategy = async (strategy: string, signer: JsonRpcSigner): Promise<string> => {
	console.log(strategy)
	const Strategy = new Contract(strategy, OZLinearVoting.abi, signer)
	const name = await Strategy.name()
	console.log(test)
	return name
}
