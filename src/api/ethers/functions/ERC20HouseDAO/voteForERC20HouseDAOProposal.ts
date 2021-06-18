import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import HouseTokenDAO from "../../abis/HouseTokenDAO.json"

const voteForERC20HouseDAOProposal = (
	daoAddress: string,
	proposalId: number,
	yes: boolean,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<void> =>
	new Promise<void>(async (resolve, reject) => {
		try {
			const daoContract = new Contract(daoAddress, HouseTokenDAO.abi, signer)
			const tx = await daoContract.vote(proposalId, yes)

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})

export default voteForERC20HouseDAOProposal
