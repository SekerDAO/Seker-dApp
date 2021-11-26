import {Contract} from "@ethersproject/contracts"
import {JsonRpcProvider} from "@ethersproject/providers"
import GovToken from "../../abis/GovToken.json"

const getERC20Symbol = async (erc20Address: string, provider: JsonRpcProvider): Promise<string> => {
	const erc20Contract = new Contract(erc20Address, GovToken.abi, provider)
	return erc20Contract.symbol()
}

export default getERC20Symbol
