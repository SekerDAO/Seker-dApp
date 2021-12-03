import {JsonRpcSigner} from "@ethersproject/providers"
import OZLinearVoting from "../../../../abis/OZLinearVoting.json"
import {finalizeVote, vote} from "../votingApi"

export const voteLinear = async (
	strategyAddress: string,
	proposalId: number,
	support: boolean,
	signer: JsonRpcSigner
): Promise<void> => vote(strategyAddress, proposalId, OZLinearVoting.abi, support, signer)

export const finalizeVoteLinear = async (
	strategyAddress: string,
	proposalId: number,
	signer: JsonRpcSigner
): Promise<void> => finalizeVote(strategyAddress, proposalId, OZLinearVoting.abi, signer)
