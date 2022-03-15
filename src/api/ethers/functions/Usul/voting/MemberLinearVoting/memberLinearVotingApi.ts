import {JsonRpcSigner} from "@ethersproject/providers"
import MemberLinearVoting from "../../../../abis/MemberLinearVoting.json"
import {finalizeVoting, vote} from "../votingApi"

export const voteMemberLinear = async (
	strategyAddress: string,
	proposalId: number,
	support: number,
	signer: JsonRpcSigner
): Promise<void> => vote(strategyAddress, proposalId, MemberLinearVoting.abi, support, signer)

export const finalizeVotingMemberLinear = async (
	strategyAddress: string,
	proposalId: number,
	signer: JsonRpcSigner
): Promise<void> => finalizeVoting(strategyAddress, proposalId, MemberLinearVoting.abi, signer)
