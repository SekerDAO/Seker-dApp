import {Contract, ContractInterface} from "@ethersproject/contracts"
import {JsonRpcSigner} from "@ethersproject/providers"
import GovToken from "../../../abis/GovToken.json"

export const vote = async (
	strategyAddress: string,
	proposalId: number,
	contractAbi: ContractInterface,
	support: boolean,
	signer: JsonRpcSigner
): Promise<void> => {
	const voting = new Contract(strategyAddress, contractAbi, signer)
	await voting.vote(proposalId, support)
}

export const finalizeVote = async (
	strategyAddress: string,
	proposalId: number,
	contractAbi: ContractInterface,
	signer: JsonRpcSigner
): Promise<void> => {
	const voting = new Contract(strategyAddress, contractAbi, signer)
	await voting.finalizeStrategy(proposalId)
}

export const delegateVote = async (
	govTokenAddress: string,
	delegatee: string,
	signer: JsonRpcSigner
): Promise<void> => {
	const govToken = new Contract(govTokenAddress, GovToken.abi, signer)
	await govToken.delegate(delegatee)
}
