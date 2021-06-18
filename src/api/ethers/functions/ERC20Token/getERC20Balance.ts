import {Contract} from "@ethersproject/contracts"
import GovToken from "../../abis/GovToken.json"
import {Web3Provider} from "@ethersproject/providers"
import {formatEther} from "@ethersproject/units"

const getERC20Balance = async (
	govTokenAddress: string,
	userAddress: string,
	provider: Web3Provider
): Promise<number> => {
	const govTokenContract = new Contract(govTokenAddress, GovToken.abi, provider)
	const balance = await govTokenContract.balanceOf(userAddress)
	return Number(formatEther(balance))
}

export default getERC20Balance
