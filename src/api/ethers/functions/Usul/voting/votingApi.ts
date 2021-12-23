import {defaultAbiCoder} from "@ethersproject/abi"
import {BigNumber} from "@ethersproject/bignumber"
import {AddressZero} from "@ethersproject/constants"
import {Contract, ContractInterface} from "@ethersproject/contracts"
import {JsonRpcProvider, JsonRpcSigner} from "@ethersproject/providers"
import {StrategyProposalVote, VOTE_CHOICES} from "../../../../../types/strategyProposal"
import GovToken from "../../../abis/GovToken.json"
import OZLinearVoting from "../../../abis/OZLinearVoting.json"

export const vote = async (
	strategyAddress: string,
	proposalId: number,
	contractAbi: ContractInterface,
	support: number, // 0 - against, 1 - for, 2 - abstain
	signer: JsonRpcSigner
): Promise<void> => {
	const voting = new Contract(strategyAddress, contractAbi, signer)
	const tx = await voting.vote(proposalId, support)
	await tx.wait()
}

export const finalizeVoting = async (
	strategyAddress: string,
	proposalId: number,
	contractAbi: ContractInterface,
	signer: JsonRpcSigner
): Promise<void> => {
	const voting = new Contract(strategyAddress, contractAbi, signer)
	const tx = await voting.finalizeStrategy(proposalId)
	await tx.wait()
}

export const delegateVote = async (
	govTokenAddress: string,
	delegatee: string,
	signer: JsonRpcSigner
): Promise<void> => {
	const govToken = new Contract(govTokenAddress, GovToken.abi, signer)
	const tx = await govToken.delegate(delegatee)
	await tx.wait()
}

export const checkDelegatee = async (
	govTokenAddress: string,
	delegatorAddress: string,
	provider: JsonRpcProvider
): Promise<string | null> => {
	const govToken = new Contract(govTokenAddress, GovToken.abi, provider)
	const delegatee = await govToken.delegates(delegatorAddress)
	if (delegatee.toLowerCase() === AddressZero.toLowerCase()) {
		return null
	}
	return delegatee
}

export const getProposalVotesList = async (
	strategyAddress: string,
	proposalId: number,
	provider: JsonRpcProvider
): Promise<StrategyProposalVote[]> => {
	const voting = new Contract(strategyAddress, OZLinearVoting.abi, provider)
	const filter = voting.filters.Voted()
	console.log(filter)
	const events = await voting.queryFilter(filter, 0, "latest")
	console.log(events)
	return events
		.map(e => {
			const [voter, id, choice] = defaultAbiCoder.decode(
				["address", "uint256", "uint8", "uint256"],
				e.data
			)
			return {
				voter,
				proposalId: id.toNumber(),
				choice: VOTE_CHOICES[choice],
				weight: BigNumber.from(0)
			}
		})
		.filter(e => e.proposalId === proposalId)
		.map(({voter, choice, weight}) => ({voter, choice, weight}))
}
