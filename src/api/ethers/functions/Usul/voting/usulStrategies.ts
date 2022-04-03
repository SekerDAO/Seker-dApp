import {AddressZero} from "@ethersproject/constants"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcProvider} from "@ethersproject/providers"
import {VOTING_STRATEGIES} from "../../../../../constants/votingStrategies"
import {VotingStrategy} from "../../../../../types/DAO"
import OZLinearVoting from "../../../abis/OZLinearVoting.json"
import Usul from "../../../abis/Usul.json"
import {getStrategyMembers} from "./votingApi"

export const getStrategies = async (
	usulAddress: string,
	provider: JsonRpcProvider
): Promise<VotingStrategy[]> => {
	const usul = new Contract(usulAddress, Usul.abi, provider)
	const addresses = await usul.getStrategiesPaginated(
		"0x0000000000000000000000000000000000000001",
		10
	)
	return Promise.all(
		addresses[0].map(async (address: string) => {
			const strategy = new Contract(address, OZLinearVoting.abi, provider)

			const name = await strategy.name()
			return {
				name,
				votingPeriod: Number((await strategy.votingPeriod()).toString()),
				quorumThreshold: Number((await strategy.quorumNumerator()).toString()),
				address,
				govTokenAddress: VOTING_STRATEGIES.find(s => s.strategy === name)?.withToken
					? await getStrategyGovTokenAddress(address, provider)
					: null,
				members: VOTING_STRATEGIES.find(s => s.strategy === name)?.withMembers
					? await getStrategyMembers(strategy.address, provider)
					: null
			}
		})
	)
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
