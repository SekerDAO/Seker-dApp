import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {Contract} from "@ethersproject/contracts"
import GovToken from "../../abis/GovToken.json"
import {parseEther} from "@ethersproject/units"

const approveERC20 = (
	governanceToken: string,
	address: string,
	totalSupply: number,
	provider: Web3Provider,
	signer: JsonRpcSigner
): Promise<void> =>
	new Promise<void>(async (resolve, reject) => {
		try {
			const ERC20Contract = new Contract(governanceToken, GovToken.abi, signer)
			const tx = await ERC20Contract.approve(address, parseEther(String(totalSupply)))

			provider.once(tx.hash, () => {
				resolve()
			})
		} catch (e) {
			reject(e)
		}
	})

export default approveERC20
