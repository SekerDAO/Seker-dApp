import {Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GovToken from "../abis/GovToken.json"
import MultiArtToken from "../abis/MultiArtToken.json"
import HouseTokenDAO from "../abis/HouseTokenDAO.json"


let roles = {
	'headOfHouse': false,
	'member': false
}
const fundingPropsal = (
	doaAddress: string,
	roles: Role,
	fundTarget: string,
	amount: number,
	signer: JsonRpcSigner,
	provider: Web3Provider
): Promise<void> => 
	new Promise<void>(async (resolve, reject) => {
		try {
			// todo: preflight checks: 1 is a member 2 has enough gov tokens
			const daoContract = new Contract(doaAddress, HouseTokenDAO.abi, provider)
			const tx = await awaitdaoContract.submitProposal(roles, fundTarget, amount, 0)

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})

const enterHouseDAOPropasl = (
	doaAddress: string,
	roles: Role,
	contribution: number,
	signer: JsonRpcSigner,
	provider: Web3Provider
): Promise<void> => 
	new Promise<void>(async (resolve, reject) => {
		try {
			const daoContract = new Contract(doaAddress, HouseTokenDAO.abi, provider)
			const tx = await awaitdaoContract.joinDAOProposal(contribution, roles)

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})

const changeRolePropsal = (
	doaAddress: string,
	roles: Role,
	fundTarget: string,
	amount: number,
	signer: JsonRpcSigner,
	provider: Web3Provider
): Promise<void> => 
	new Promise<void>(async (resolve, reject) => {
		try {
			// todo: preflight checks: 1 is a member 2 has enough gov tokens
			const daoContract = new Contract(doaAddress, HouseTokenDAO.abi, provider)
			const tx = await awaitdaoContract.submitProposal(roles, signer, 0, 1)

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})


// TODO: open exection proposal type