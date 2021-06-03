import {Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import HouseTokenDAO from "../abis/HouseTokenDAO.json"

const initHouseGovDAO = async (
	address: string, // gov token address
	provider: Web3Provider
): Promise<boolean> => {
	const HouseTokenDAOContract = new Contract(address, HouseTokenDAO.abi, provider)
	const _tx = await HouseTokenDAOContract.init()

	provider.once(_tx.hash, receipt => {
		console.log("Transaction Minded: " + receipt.transactionHash)
		console.log(receipt)
		return true
	})
	return false
}

export default initHouseGovDAO
