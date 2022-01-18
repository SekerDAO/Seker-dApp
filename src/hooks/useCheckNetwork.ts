import {BigNumber} from "@ethersproject/bignumber"
import {useContext} from "react"
import config from "../config"
import {AuthContext} from "../context/AuthContext"

const useCheckNetwork = <T extends unknown[], R>(
	func: (...args: T) => Promise<R>,
	requiredChainId: number = config.CHAIN_ID
): ((...args: T) => Promise<R>) => {
	const {externalProvider} = useContext(AuthContext)

	return async (...args) => {
		if (!externalProvider) {
			throw new Error("No wallet connected")
		}
		await externalProvider.request!({
			method: "wallet_switchEthereumChain",
			params: [
				{
					chainId: BigNumber.from(requiredChainId).toHexString()
				}
			]
		})
		return func(...args)
	}
}

export default useCheckNetwork
