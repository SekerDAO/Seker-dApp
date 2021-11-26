import GovToken from "../../abis/GovToken.json"
import {Contract} from "@ethersproject/contracts"
import {JsonRpcProvider} from "@ethersproject/providers"

const getERC20Symbol = async (erc20Address: string, provider: JsonRpcProvider): Promise<string> => {
	const erc20Contract = new Contract(erc20Address, GovToken.abi, provider)
	return erc20Contract.symbol()
}

export default getERC20Symbol
