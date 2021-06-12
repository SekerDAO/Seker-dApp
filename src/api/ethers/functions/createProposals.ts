import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import HouseTokenDAO from "../abis/HouseTokenDAO.json"
import {HouseDAORole} from "../../../types/DAO"
import {BigNumber} from "@ethersproject/bignumber"

export const fundingProposal = (
	doaAddress: string,
	fundTarget: string,
	amount: number,
	provider: Web3Provider
): Promise<void> =>
	new Promise<void>(async (resolve, reject) => {
		try {
			// todo: preflight checks: 1 is a member 2 has enough gov tokens
			const daoContract = new Contract(doaAddress, HouseTokenDAO.abi, provider)
			daoContract.once("ProposalCreated", (error, event) => {
				console.log(event.args.number.toString())
			})

			const tx = await daoContract.submitProposal(0, fundTarget, amount, 0)

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})

export const enterHouseDAOProposal = (
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

			const tx = await daoContract.joinDAOProposal(0, {
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

export const changeRoleProposal = (
	doaAddress: string,
	role: HouseDAORole | "kick",
	fundTarget: string,
	amount: number,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<void> =>
	new Promise<void>(async (resolve, reject) => {
		try {
			// todo: preflight checks: 1 is a member 2 has enough gov tokens
			const daoContract = new Contract(doaAddress, HouseTokenDAO.abi, provider)
			daoContract.once("ProposalCreated", (error, event) => {
				console.log(event.args.number.toString())
			})

			const tx = await daoContract.submitProposal({member: role !== "kick", headOfHouse: role === "head"}, signer, 0, 1)

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})

// TODO: open exection proposal type
