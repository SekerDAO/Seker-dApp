import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import HouseTokenDAO from "../../abis/HouseTokenDAO.json"
import {BigNumber} from "@ethersproject/bignumber"

export const startERC20DAOFundingGracePeriod = (
	daoAddress: string,
	proposalId: number,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<string> =>
	new Promise<string>(async (resolve, reject) => {
		try {
			let isMined = false
			let endDate: string

			const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, signer)
			daoContract.once("GracePeriodStarted", (date: BigNumber) => {
				const _endDate = new Date(Number(date.toString()) * 1000).toISOString()
				if (isMined) {
					resolve(_endDate)
				} else {
					endDate = _endDate
				}
			})

			const tx = await daoContract.startFundingProposalGracePeriod(proposalId)

			provider.once(tx.hash, () => {
				if (endDate !== undefined) {
					resolve(endDate)
				} else {
					isMined = true
				}
			})
		} catch (e) {
			reject(e)
		}
	})

export const startERC20DAORoleChangeGracePeriod = (
	daoAddress: string,
	proposalId: number,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<string> =>
	new Promise<string>(async (resolve, reject) => {
		try {
			let isMined = false
			let endDate: string

			const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, signer)
			daoContract.once("GracePeriodStarted", (date: BigNumber) => {
				const _endDate = new Date(Number(date.toString()) * 1000).toISOString()
				if (isMined) {
					resolve(_endDate)
				} else {
					endDate = _endDate
				}
			})

			const tx = await daoContract.startRoleProposalGracePeriod(proposalId)

			provider.once(tx.hash, () => {
				if (endDate !== undefined) {
					resolve(endDate)
				} else {
					isMined = true
				}
			})
		} catch (e) {
			reject(e)
		}
	})
