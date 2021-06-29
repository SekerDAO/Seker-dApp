import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import HouseTokenDAO from "../../abis/HouseTokenDAO.json"

export const executeERC20HouseDAORoleChange = (
	daoAddress: string,
	proposalId: number,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<void> =>
	new Promise<void>(async (resolve, reject) => {
		try {
			const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, signer)
			const tx = await daoContract.executeChangeRoleProposal(proposalId)

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})

export const executeERC20HouseDAOFundingProposal = (
	daoAddress: string,
	proposalId: number,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<void> =>
	new Promise<void>(async (resolve, reject) => {
		try {
			const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, signer)
			const tx = await daoContract.executeFundingProposal(proposalId)

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})
