import {AddressZero} from "@ethersproject/constants"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcProvider} from "@ethersproject/providers"
import GovToken from "../../abis/GovToken.json"

const checkErc20Wrapped = async (
	tokenAddress: string,
	provider: JsonRpcProvider
): Promise<boolean> => {
	const contract = new Contract(tokenAddress, GovToken.abi, provider)
	try {
		await contract.delegates(AddressZero)
		return true
	} catch (e) {
		return false
	}
}

export default checkErc20Wrapped
