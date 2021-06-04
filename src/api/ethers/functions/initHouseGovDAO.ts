import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import HouseTokenDAO from "../abis/HouseTokenDAO.json"

const initHouseGovDAO = (address: string, provider: Web3Provider, signer: JsonRpcSigner): Promise<void> =>
	new Promise<void>(async (resolve, reject) => {
		try {
			const HouseTokenDAOContract = new Contract(address, HouseTokenDAO.abi, signer)
			const tx = await HouseTokenDAOContract.init()

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})

export default initHouseGovDAO
