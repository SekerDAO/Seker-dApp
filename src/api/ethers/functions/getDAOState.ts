import {Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GovToken from "../abis/GovToken.json"
import MultiArtToken from "../abis/MultiArtToken.json"
import HouseTokenDAO from "../abis/HouseTokenDAO.json"

export const getERC20Symbol = async (erc20Address: string, provider: Web3Provider): Promise<string> => {
	const erc20Contract = new Contract(erc20Address, GovToken.abi, provider)
	return erc20Contract.symbol()
}

export const getERC721Symbol = async (erc721Address: string, provider: Web3Provider): Promise<string> => {
	const erc721Contract = new Contract(erc721Address, MultiArtToken.abi, provider)
	return erc721Contract.symbol()
}

export const getHouseERC20Balance = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return daoContract.balance()
}

// todo: getHouseERC721Balance + getGalleryBalance

export const getHouseERC20FundedProjects = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return daoContract.fundedProjects()
}

// todo: getHouseERC721FundedProjects

export const getHouseERC20MemberCount = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return daoContract.memberCount()
}

// todo: getHouseERC721MemberCount

export const getHouseERC20EntryReward = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return daoContract.entryReward()
}

export const getHouseERC20MinimumProposalAmount = async (
	daoAddress: string,
	provider: Web3Provider
): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return daoContract.minimumProposalAmount()
}

// todo: getHouseERC721MinimumProposalAmount

export const getHouseERC20DecisionSpeed = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return daoContract.proposalTime()
}

// todo: getHouseERC721DecisionSpeed + gallery

export const getHouseERC20VotingThreshold = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return daoContract.threshold()
}

// todo: getHouseERC721DVotingThreshold + gallery

export const getHouseERC20ProposalCount = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return daoContract.totalProposalCount()
}

// todo: getHouseERC721ProposalCount + gallery

export const getHouseERC20GovTokenSupply = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return daoContract.remainingSupply()
}

// todo: getHouseERC721GovTokenSupply + gallery
