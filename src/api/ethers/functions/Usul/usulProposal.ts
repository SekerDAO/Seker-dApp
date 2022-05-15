import {BigNumberish} from "@ethersproject/bignumber"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcProvider, JsonRpcSigner} from "@ethersproject/providers"
import {
	StrategyProposalState,
	strategyProposalStates,
	StrategyProposalVotesSummary
} from "../../../../types/strategyProposal"
import OZLinearVoting from "../../abis/OZLinearVoting.json"
import Usul from "../../abis/Usul.json"
import {SafeTransaction} from "../gnosisSafe/safeUtils"

export const submitProposal = async (
	usulAddress: string,
	strategyAddress: string,
	transactions: SafeTransaction[],
	signer: JsonRpcSigner,
	extraData = "0x"
): Promise<number> =>
	new Promise(async (resolve, reject) => {
		try {
			const usulProxy = new Contract(usulAddress, Usul.abi, signer)
			const hashes = await Promise.all(
				transactions.map(
					async (tx): Promise<string> =>
						usulProxy.getTransactionHash(tx.to, tx.value, tx.data, tx.operation)
				)
			)
			const userAddress = await signer.getAddress()

			const eventListener = async (
				strategy: string,
				proposalId: BigNumberish,
				proposer: string
			) => {
				try {
					if (
						!(
							strategy.toLowerCase() === strategyAddress.toLowerCase() &&
							proposer.toLowerCase() === userAddress.toLowerCase()
						)
					) {
						return
					}
					usulProxy.off("ProposalCreated", eventListener)
					resolve(Number(proposalId.toString()))
				} catch (e) {
					reject(e)
				}
			}

			usulProxy.on("ProposalCreated", eventListener)

			await usulProxy.submitProposal(hashes, strategyAddress, extraData)
		} catch (err) {
			reject(err)
		}
	})

export const getProposalState = async (
	usulAddress: string,
	proposalId: number,
	provider: JsonRpcProvider
): Promise<{state: StrategyProposalState; deadline?: number}> => {
	const usul = new Contract(usulAddress, Usul.abi, provider)
	const state = await usul.state(proposalId)
	if (state === 0) {
		// Usul says proposal is active, but we need to get more info in this case
		const {strategy: strategyAddress} = await usul.proposals(proposalId)
		const strategy = new Contract(strategyAddress, OZLinearVoting.abi, provider)
		const {deadline} = await strategy.proposals(proposalId)
		if (Number(deadline.toString()) * 1000 < new Date().getTime()) {
			// Deadline has passed: we have to determine if proposal is passed or failed
			// Dirty hack: isPassed will fail if the proposal is not passed
			try {
				// This function never returns false, it either returns true or throws an error
				await strategy.isPassed(proposalId)
				return {state: "pending"}
			} catch (e) {
				if (e.message.match("majority yesVotes not reached")) {
					return {state: "failed"}
				} else if (e.message.match("a quorum has not been reached for the proposal")) {
					return {state: "failed"}
				} else if (e.message.match("voting period has not passed yet")) {
					// TODO: I don't know, why we sometimes can get here despite the deadline check above
					return {state: "active", deadline: deadline.toNumber()}
				}
				// TODO: side chain provider doesn't provide meaningful info
				// TODO: looks like a provider issue, if you fetch the state right after proposal changes
				// its state to "pending", you get this error
				return {state: "failed"}
			}
		}
		return {state: "active", deadline: deadline.toNumber()}
	}
	return {state: strategyProposalStates[state]}
}

export const getProposalVotesSummary = async (
	usulAddress: string,
	proposalId: number,
	provider: JsonRpcProvider
): Promise<StrategyProposalVotesSummary> => {
	const usul = new Contract(usulAddress, Usul.abi, provider)
	const {strategy: strategyAddress} = await usul.proposals(proposalId)
	const strategy = new Contract(strategyAddress, OZLinearVoting.abi, provider)
	const {yesVotes, noVotes, abstainVotes, startBlock} = await strategy.proposals(proposalId)
	return {
		yes: yesVotes,
		no: noVotes,
		abstain: abstainVotes,
		quorum: await strategy.quorum(startBlock)
	}
}
