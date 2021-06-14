import {Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GovToken from "../abis/GovToken.json"
import MultiArtToken from "../abis/MultiArtToken.json"
import HouseTokenDAO from "../abis/HouseTokenDAO.json"

// DAO contract state getters
export const getERC20Symbol = async (erc20Address: string, provider: Web3Provider): Promise<string> => {
	const erc20Contract = new Contract(erc20Address, GovToken.abi, provider)
	return await erc20Contract.symbol()
}
export const getERC721Symbol = async (erc721Address: string, provider: Web3Provider): Promise<string> => {
	const erc721Contract = new Contract(erc721Address, MultiArtToken.abi, provider)
	return await erc721Contract.symbol()
}
export const getHouseERC20Balance = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return await daoContract.balance()
}
// todo: getHouseERC721Balance + getGalleryBalance
export const getHouseERC20FundedProjects = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return await daoContract.fundedProjects()
}
// todo: getHouseERC721FundedProjects
export const getHouseERC20MemberCount = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return await daoContract.memberCount()
}
// todo: getHouseERC721MemberCount
export const getHouseERC20MinimumProposalAmount = async (
	daoAddress: string,
	provider: Web3Provider
): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return await daoContract.minimumProposalAmount()
}
// todo: getHouseERC721MinimumProposalAmount
export const getHouseERC20DecisionSpeed = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return await daoContract.proposalTime()
}
// todo: getHouseERC721DecisionSpeed + gallery
export const getHouseERC20VotingThreshold = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return await daoContract.threshold()
}
// todo: getHouseERC721DVotingThreshold + gallery
export const getHouseERC20ProposalCount = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return await daoContract.totalProposalCount()
}
// todo: getHouseERC721ProposalCount + gallery
export const getHouseERC20GovTokenSupply = async (daoAddress: string, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	return await daoContract.daoGovernanceSupply()
}
// todo: getHouseERC721GovTokenSupply + gallery


// Proposal Data Getters
export const getHouseERC20ProposalExecuted = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<bool> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	return proposal.executed
}
export const getHouseERC20ProposalCanceled = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<bool> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	return proposal.canceled
}
export const getHouseERC20ProposalDeadline = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<bool> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	return proposal.deadline
}
export const getHouseERC20ProposalDeadline = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	return proposal.deadline
}
export const getHouseERC20ProposalFundsRequested = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	return proposal.fundsRequested
}
export const getHouseERC20ProposalProposalType = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	return proposal.proposalType
}
export const getHouseERC20ProposalTargetAddress = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<string> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	return proposal.targetAddress
}
export const getHouseERC20ProposalRole = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<Role> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	// todo return Role type
	//return proposal.role
}
export const getHouseERC20ProposalYesVotes = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	return proposal.yesVotes
}
export const getHouseERC20ProposalNoVotes = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	return proposal.noVotes
}
export const getHouseERC20ProposalProposer = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<address> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	return proposal.proposer
}
export const getHouseERC20ProposalGracePeriod = async (daoAddress: string, proposalId: number, provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const proposal = await daoContract.proposals(proposalId)
	return proposal.gracePeriod
}

// membership Data Getters
export const getHouseERC20MemberHeadOfHouse = async (daoAddress: string, member: address provider: Web3Provider): Promise<bool> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const _member = await daoContract.members(member)
	return _member.roles.headOfHouse
}
export const getHouseERC20Member = async (daoAddress: string, member: address provider: Web3Provider): Promise<bool> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const _member = await daoContract.members(member)
	return _member.roles.member
}
export const getHouseERC20MemberShares = async (daoAddress: string, member: address provider: Web3Provider): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const _member = await daoContract.members(member)
	return _member.shares
}
export const getHouseERC20MemberActiveProposal = async (daoAddress: string, member: address provider: Web3Provider): Promise<bool> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const _member = await daoContract.members(member)
	return _member.activeProposal
}