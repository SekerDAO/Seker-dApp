import HouseTokenDAO from "../abis/HouseTokenDAO.json"
import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {ContractFactory} from "@ethersproject/contracts"
import {parseEther} from "@ethersproject/units"
import approveERC20 from "./approveERC20"
import initHouseGovDAO from "./initHouseGovDAO"
const {REACT_APP_WETH_ADDRESS} = process.env

const deployHouseERC20DAO = async (
	name: string,
	headsOfHouse: string[],
	governanceToken: string,
	minEntryContribution: number,
	proposalSpeed: number,
	governanceTokenSupply: number,
	votingThreshold: number,
	minProposalAmount: number,
	govTokensAwarded: number,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<string> => {
	const dao = new ContractFactory(HouseTokenDAO.abi, HouseTokenDAO.bytecode, signer)
	const contract = await dao.deploy(
		headsOfHouse,
		governanceToken,
		parseEther(String(minEntryContribution)),
		proposalSpeed,
		parseEther(String(governanceTokenSupply)),
		parseEther(String(votingThreshold)),
		parseEther(String(minProposalAmount)),
		parseEther(String(govTokensAwarded)),
		REACT_APP_WETH_ADDRESS
	)

	await contract.deployed()
	// TODO if(governanceTokenSupply > O) {
	await approveERC20(governanceToken, contract.address, governanceTokenSupply, provider, signer)
	await initHouseGovDAO(contract.address, provider, signer)
	// }

	return contract.address
}

export default deployHouseERC20DAO
