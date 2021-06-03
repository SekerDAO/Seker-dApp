import HouseTokenDAO from "../abis/HouseTokenDAO.json"
import {BigNumber} from "@ethersproject/bignumber"
import {JsonRpcSigner} from "@ethersproject/providers"
import {ContractFactory} from "@ethersproject/contracts"

const deployHouseERC20DAO = async (
	name: string,
	signer: JsonRpcSigner,
	headsOfHouse: [string],
	governanceToken: string,
	minEntryContribution: number,
	proposalSpeed: number,
	governanceTokenSupply: number,
	votingThreshold: number,
	minProposalAmount: number,
	govTokensAwarded: number,
	weth: number
): Promise<string> => {
	const one = BigNumber.from("1000000000000000000")
	// 18 decimal converstions, assume all inputs are natural numbers
	const govtotalSupplyBN = BigNumber.from(governanceTokenSupply)
	const govtotalSupply18Decimals = govtotalSupplyBN.mul(one)

	const minEntryContributionBN = BigNumber.from(minEntryContribution)
	const minEntryContribution18Decimals = minEntryContributionBN.mul(one)

	const votingThresholdBN = BigNumber.from(votingThreshold)
	const votingThreshold18Decimals = votingThresholdBN.mul(one)

	const minProposalAmountBN = BigNumber.from(minProposalAmount)
	const minProposalAmount18Decimals = minProposalAmountBN.mul(one)

	const govTokensAwardedBN = BigNumber.from(govTokensAwarded)
	const govTokensAwarded18Decimals = govTokensAwardedBN.mul(one)

	const dao = new ContractFactory(HouseTokenDAO.abi, HouseTokenDAO.bytecode, signer)
	const contract = await dao.deploy(
		headsOfHouse,
		governanceToken,
		minEntryContribution,
		proposalSpeed,
		governanceTokenSupply,
		votingThreshold,
		minProposalAmount,
		govTokensAwarded,
		weth
	)
	await contract.deployed()
	return contract.address
}

export default deployHouseERC20DAO
