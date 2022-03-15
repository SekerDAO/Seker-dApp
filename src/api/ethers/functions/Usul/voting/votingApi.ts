import {defaultAbiCoder} from "@ethersproject/abi"
import {BigNumber} from "@ethersproject/bignumber"
import {AddressZero} from "@ethersproject/constants"
import {Contract, ContractInterface} from "@ethersproject/contracts"
import {id} from "@ethersproject/hash"
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
	const tx = await voting.vote(proposalId, support, "0x")
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
	provider: JsonRpcProvider,
	sideChain: boolean
): Promise<StrategyProposalVote[]> => {
	const voting = new Contract(strategyAddress, OZLinearVoting.abi, provider)
	// TODO: for some reason weight is missing for kovan and rinkeby
	const filter = sideChain
		? voting.filters.Voted()
		: {
				address: strategyAddress,
				topics: [id("Voted(address,uint256,uint8)")]
		  }
	const events = await voting.queryFilter(filter, 0, "latest")
	return events
		.map(e => {
			if (sideChain) {
				const [voter, _proposalId, choice, weight] = defaultAbiCoder.decode(
					["address", "uint256", "uint8", "uint256"],
					e.data
				)
				return {
					voter,
					proposalId: _proposalId.toNumber(),
					choice: VOTE_CHOICES[choice],
					weight
				}
			} else {
				// TODO: fix weight
				const [voter, _proposalId, choice] = defaultAbiCoder.decode(
					["address", "uint256", "uint8"],
					e.data
				)
				return {
					voter,
					proposalId: _proposalId.toNumber(),
					choice: VOTE_CHOICES[choice],
					weight: BigNumber.from(0)
				}
			}
		})
		.filter(e => e.proposalId === proposalId)
		.map(({voter, choice, weight}) => ({voter, choice, weight}))
}

export const hasVoted = async (
	strategyAddress: string,
	proposalId: number,
	userAddress: string,
	provider: JsonRpcProvider
): Promise<boolean> => {
	const voting = new Contract(strategyAddress, OZLinearVoting.abi, provider)
	return voting.hasVoted(proposalId, userAddress)
}
