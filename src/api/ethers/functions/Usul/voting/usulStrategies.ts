import {AddressZero} from "@ethersproject/constants"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcProvider} from "@ethersproject/providers"
import {VotingStrategy} from "../../../../../types/DAO"
import OZLinearVoting from "../../../abis/OZLinearVoting.json"
import Usul from "../../../abis/Usul.json"

export const getStrategies = async (
	usulAddress: string,
	provider: JsonRpcProvider
): Promise<VotingStrategy[]> => {
	const usulProxy = new Contract(usulAddress, Usul.abi, provider)
	const addresses = await usulProxy.getStrategiesPaginated(
		"0x0000000000000000000000000000000000000001",
		10
	)
	return Promise.all(
		addresses[0].map(async (address: string) => ({
			name: await getStrategyName(address, provider),
			address
		}))
	)
}

export const getStrategyName = async (
	strategyAddress: string,
	provider: JsonRpcProvider
): Promise<string> => {
	const strategy = new Contract(strategyAddress, OZLinearVoting.abi, provider)
	return strategy.name()
}

export const getStrategyGovTokenAddress = async (
	strategyAddress: string,
	provider: JsonRpcProvider
): Promise<string | null> => {
	const strategy = new Contract(strategyAddress, OZLinearVoting.abi, provider)
	const govTokenAddress = await strategy.governanceToken()
	if (govTokenAddress.toLowerCase() === AddressZero.toLowerCase()) {
		return null
	}
	return govTokenAddress
}
