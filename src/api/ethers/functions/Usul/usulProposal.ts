import {BigNumberish} from "@ethersproject/bignumber"
import {Contract, ContractInterface} from "@ethersproject/contracts"
import {JsonRpcProvider, JsonRpcSigner} from "@ethersproject/providers"
import {StrategyProposalState, strategyProposalStates} from "../../../../types/strategyProposal"
import Usul from "../../abis/Usul.json"
import {buildContractCall, SafeTransaction} from "../gnosisSafe/safeUtils"

const generateTxHashes = async (
	usulAddress: string,
	transactions: SafeTransaction[],
	signer: JsonRpcSigner
): Promise<string[]> => {
	const usulProxy = new Contract(usulAddress, Usul.abi, signer)
	return Promise.all(
		transactions.map(
			async (tx): Promise<string> =>
				usulProxy.getTransactionHash(tx.to, tx.value, tx.data, tx.operation)
		)
	)
}

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
			const hashes = await generateTxHashes(usulAddress, transactions, signer)
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

export const buildProposalTx = async (
	contractAddress: string,
	contractAbi: ContractInterface,
	method: string,
	args: unknown[],
	provider: JsonRpcProvider
): Promise<SafeTransaction> => {
	const contract = new Contract(contractAddress, contractAbi, provider)
	return buildContractCall(contract, method, args, 0)
}

export const executeProposalSingle = async (
	usulAddress: string,
	proposalId: number,
	target: string,
	value: number,
	txData: string,
	operation: number,
	provider: JsonRpcProvider
): Promise<void> => {
	const usul = new Contract(usulAddress, Usul.abi, provider)
	await usul.executeProposalByIndex(proposalId, target, value, txData, operation)
}

export const executeProposalBatch = async (
	usulAddress: string,
	proposalId: number,
	targets: string[],
	values: number[],
	txDatas: string[],
	operations: number[],
	provider: JsonRpcProvider
): Promise<void> => {
	const usul = new Contract(usulAddress, Usul.abi, provider)
	await usul.executeProposalBatch(proposalId, targets, values, txDatas, operations)
}

export const getProposalState = async (
	usulAddress: string,
	proposalId: number,
	provider: JsonRpcProvider
): Promise<StrategyProposalState> => {
	const usul = new Contract(usulAddress, Usul.abi, provider)
	const state = await usul.state(proposalId)
	return strategyProposalStates[state]
}
