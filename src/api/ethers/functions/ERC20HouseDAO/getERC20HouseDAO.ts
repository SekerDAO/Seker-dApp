import {Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import MultiArtToken from "../../abis/MultiArtToken.json"
import HouseTokenDAO from "../../abis/HouseTokenDAO.json"
import {ProposalEtherData} from "../../../../types/proposal"
import {formatEther} from "@ethersproject/units"

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
	return daoContract.daoGovernanceSupply()
}
// todo: getHouseERC721GovTokenSupply + gallery

export const getHouseERC20DAOProposal = async (
	daoAddress: string,
	proposalId: number,
	provider: Web3Provider
): Promise<ProposalEtherData> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const votingThreshold = await daoContract.threshold()
	const data = await daoContract.proposals(proposalId)

	const yesVotes = Number(formatEther(data.yesVotes))
	const noVotes = Number(formatEther(data.noVotes))
	const threshold = Number(formatEther(votingThreshold))
	const deadline = new Date(Number(data.deadline.toString()) * 1000)

	return {
		id: proposalId,
		type: data.proposalType === 0 ? "requestFunding" : data.proposalType === 1 ? "changeRole" : "joinHouse",
		userAddress: data.proposer,
		// TODO check if passed before executed
		state: data.executed
			? "executed"
			: data.canceled
			? "canceled"
			: data.gracePeriod > 0
			? "queued"
			: deadline < new Date()
			? yesVotes > threshold && yesVotes > noVotes
				? "passed"
				: "failed"
			: "active",
		amount: Number(formatEther(data.fundsRequested)),
		yesVotes,
		noVotes,
		deadline: deadline.toISOString(),
		gracePeriod: data.gracePeriod.toString() === "0" ? null : new Date().toISOString()
	}
}

// membership Data Getters
export const getHouseERC20MemberHeadOfHouse = async (
	daoAddress: string,
	member: string,
	provider: Web3Provider
): Promise<boolean> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const _member = await daoContract.members(member)
	return _member.roles.headOfHouse
}
export const getHouseERC20Member = async (
	daoAddress: string,
	member: string,
	provider: Web3Provider
): Promise<boolean> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const _member = await daoContract.members(member)
	return _member.roles.member
}
export const getHouseERC20MemberShares = async (
	daoAddress: string,
	member: string,
	provider: Web3Provider
): Promise<number> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const _member = await daoContract.members(member)
	return _member.shares
}
export const getHouseERC20MemberActiveProposal = async (
	daoAddress: string,
	member: string,
	provider: Web3Provider
): Promise<boolean> => {
	const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
	const _member = await daoContract.members(member)
	return _member.activeProposal
}
