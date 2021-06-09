import {Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GovToken from "../abis/GovToken.json"
import MultiArtToken from "../abis/MultiArtToken.json"
import HouseTokenDAO from "../abis/HouseTokenDAO.json"

const getERC20Symbol = async (erc20Address: string, provider: Web3Provider): Promise<string> => {
	const erc20Contract = new Contract(erc20Address, GovToken.abi, provider)
	const symbol = await erc20Contract.symbol()
	return symbol
}

const getERC721Symbol = async (erc721Address: string, provider: Web3Provider): Promise<string> => {
	const erc721Contract = new Contract(erc721Address, MultiArtToken.abi, provider)
	const symbol = await erc721Contract.symbol()
	return symbol
}

const getHouseERC20Balance = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const balance = await daoContract.balance()
	return balance
}

// todo: getHouseERC721Balance + getGalleryBalance

const getHouseERC20FundedProjects = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const fundedProjects = await daoContract.fundedProjects()
	return fundedProjects
}

// todo: getHouseERC721FundedProjects

const getHouseERC20MemberCount = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const memberCount = await daoContract.memberCount()
	return memberCount
}

// todo: getHouseERC721MemberCount

const getHouseERC20EntryReward = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const entryReward = await daoContract.entryReward()
	return entryReward
}

const getHouseERC20MinimumProposalAmount = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const minimumProposalAmount = await daoContract.minimumProposalAmount()
	return minimumProposalAmount
}

// todo: getHouseERC721MinimumProposalAmount

const getHouseERC20DecisionSpeed = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposalTime = await daoContract.proposalTime()
	return proposalTime
}

// todo: getHouseERC721DecisionSpeed + gallery

const getHouseERC20VotingThreshold = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const threshold = await daoContract.threshold()
	return threshold
}

// todo: getHouseERC721DVotingThreshold + gallery

const getHouseERC20ProposalCount = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const totalProposalCount = await daoContract.totalProposalCount()
	return totalProposalCount
}

// todo: getHouseERC721ProposalCount + gallery

const getHouseERC20GovTokenSupply = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const remainingSupply = await daoContract.remainingSupply()
	return remainingSupply
}

// todo: getHouseERC721GovTokenSupply + gallery


