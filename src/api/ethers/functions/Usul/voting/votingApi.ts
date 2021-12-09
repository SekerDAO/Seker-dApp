import {AddressZero} from "@ethersproject/constants"
import {Contract, ContractInterface} from "@ethersproject/contracts"
import {JsonRpcProvider, JsonRpcSigner} from "@ethersproject/providers"
import GovToken from "../../../abis/GovToken.json"

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
