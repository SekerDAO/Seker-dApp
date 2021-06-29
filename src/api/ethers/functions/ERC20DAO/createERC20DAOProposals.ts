import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import HouseTokenDAO from "../../abis/HouseTokenDAO.json"
import {HouseDAORole} from "../../../../types/DAO"
import {BigNumber} from "@ethersproject/bignumber"
import {parseEther} from "@ethersproject/units"

export const createERC20DAOFundingProposal = (
	daoAddress: string,
	fundTarget: string,
	amount: number,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<number> =>
	new Promise<number>(async (resolve, reject) => {
		try {
			let isMined = false
			let proposalId: number
			// todo: preflight checks: 1 is a member 2 has enough gov tokens
			const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, signer)
			daoContract.once("ProposalCreated", (id: BigNumber) => {
				const _id = Number(id.toString())
				if (isMined) {
					resolve(_id)
				} else {
					proposalId = _id
				}
			})

			const tx = await daoContract.submitProposal(0, fundTarget, parseEther(String(amount)), 0)

			provider.once(tx.hash, () => {
				if (proposalId !== undefined) {
					resolve(proposalId)
				} else {
					isMined = true
				}
			})
		} catch (e) {
			reject(e)
		}
	})

export const createEnterERC20DAOProposal = (
	daoAddress: string,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<number> =>
	new Promise<number>(async (resolve, reject) => {
		try {
			let isMined = false
			let proposalId: number
			const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, signer)
			daoContract.once("ProposalCreated", (id: BigNumber) => {
				const _id = Number(id.toString())
				if (isMined) {
					resolve(_id)
				} else {
					proposalId = _id
				}
			})

			const tx = await daoContract.joinDAOProposal({
				headOfHouse: false,
				member: true
			})

			provider.once(tx.hash, () => {
				if (proposalId !== undefined) {
					resolve(proposalId)
				} else {
					isMined = true
				}
			})
		} catch (e) {
			reject(e)
		}
	})

export const createERC20DAOChangeRoleProposal = (
	daoAddress: string,
	role: HouseDAORole | "kick",
	fundTarget: string,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<number> =>
	new Promise<number>(async (resolve, reject) => {
		try {
			let isMined = false
			let proposalId: number
			// todo: preflight checks: 1 is a member 2 has enough gov tokens
			const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, signer)
			daoContract.once("ProposalCreated", (id: BigNumber) => {
				const _id = Number(id.toString())
				if (isMined) {
					resolve(_id)
				} else {
					proposalId = _id
				}
			})

			const tx = await daoContract.submitProposal(
				{member: role !== "kick", headOfHouse: role === "head"},
				fundTarget,
				0,
				1
			)

			provider.once(tx.hash, () => {
				if (proposalId !== undefined) {
					resolve(proposalId)
				} else {
					isMined = true
				}
			})
		} catch (e) {
			reject(e)
		}
	})

// TODO: open exection proposal type
