import {JsonRpcSigner} from "@ethersproject/providers"
import MemberSingleVoting from "../../../../abis/SimpleMemberVoting.json"
import {finalizeVoting, vote} from "../votingApi"

export const voteMemberSingle = async (
	strategyAddress: string,
	proposalId: number,
	support: number,
	signer: JsonRpcSigner
): Promise<void> => vote(strategyAddress, proposalId, MemberSingleVoting.abi, support, signer)

export const finalizeVotingMemberSingle = async (
	strategyAddress: string,
	proposalId: number,
	signer: JsonRpcSigner
): Promise<void> => finalizeVoting(strategyAddress, proposalId, MemberSingleVoting.abi, signer)
