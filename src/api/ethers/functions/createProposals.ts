import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import HouseTokenDAO from "../abis/HouseTokenDAO.json"
import {HouseDAORole} from "../../../types/DAO"

export const fundingProposal = (
	doaAddress: string,
	fundTarget: string,
	amount: number,
	signer: JsonRpcSigner,
	provider: Web3Provider
): Promise<void> =>
	new Promise<void>(async (resolve, reject) => {
		try {
			// todo: preflight checks: 1 is a member 2 has enough gov tokens
			const daoContract = new Contract(doaAddress, HouseTokenDAO.abi, provider)
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
	contribution: number,
	signer: JsonRpcSigner,
	provider: Web3Provider
): Promise<void> =>
	new Promise<void>(async (resolve, reject) => {
		try {
			const roles = {
				headOfHouse: false,
				member: true
			}
			const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, provider)
			const tx = await daoContract.joinDAOProposal(contribution, roles)

			provider.once(tx.hash, () => {
				resolve()
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
	signer: JsonRpcSigner,
	provider: Web3Provider
): Promise<void> =>
	new Promise<void>(async (resolve, reject) => {
		try {
			// todo: preflight checks: 1 is a member 2 has enough gov tokens
			const daoContract = new Contract(doaAddress, HouseTokenDAO.abi, provider)
			const tx = await daoContract.submitProposal({member: role !== "kick", headOfHouse: role === "head"}, signer, 0, 1)

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})

// TODO: open exection proposal type
