import {JsonRpcSigner} from "@ethersproject/providers"
import OZLinearVoting from "../../../../abis/OZLinearVoting.json"
import {finalizeVoting, vote} from "../votingApi"

export const voteOzLinear = async (
	strategyAddress: string,
	proposalId: number,
	support: number,
	signer: JsonRpcSigner
): Promise<void> => vote(strategyAddress, proposalId, OZLinearVoting.abi, support, signer)

export const finalizeVotingOzLinear = async (
	strategyAddress: string,
	proposalId: number,
	signer: JsonRpcSigner
): Promise<void> => finalizeVoting(strategyAddress, proposalId, OZLinearVoting.abi, signer)
