import {Contract} from "@ethersproject/contracts"
import GovToken from "../../abis/GovToken.json"
import {JsonRpcProvider} from "@ethersproject/providers"
import {formatEther} from "@ethersproject/units"

const getERC20Balance = async (
	govTokenAddress: string,
	userAddress: string,
	provider: JsonRpcProvider
): Promise<number> => {
	const govTokenContract = new Contract(govTokenAddress, GovToken.abi, provider)
	const balance = await govTokenContract.balanceOf(userAddress)
	return Number(formatEther(balance))
}

export default getERC20Balance
