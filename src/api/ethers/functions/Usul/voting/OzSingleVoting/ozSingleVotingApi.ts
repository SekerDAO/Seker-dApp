import {JsonRpcSigner} from "@ethersproject/providers"
import OZSingleVoting from "../../../../abis/OZSingleVoting.json"
import {finalizeVoting, vote} from "../votingApi"

export const voteOzSingle = async (
	strategyAddress: string,
	proposalId: number,
	support: number,
	signer: JsonRpcSigner
): Promise<void> => vote(strategyAddress, proposalId, OZSingleVoting.abi, support, signer)

export const finalizeVotingOzSingle = async (
	strategyAddress: string,
	proposalId: number,
	signer: JsonRpcSigner
): Promise<void> => finalizeVoting(strategyAddress, proposalId, OZSingleVoting.abi, signer)
