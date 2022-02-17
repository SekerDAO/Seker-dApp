import {BigNumber} from "@ethersproject/bignumber"
import {useContext} from "react"
import config from "../config"
import {AuthContext} from "../context/AuthContext"
import MetamaskWarnModalContext from "../context/MetamaskWarnModalContext"

const useCheckNetwork = <T extends unknown[], R>(
	func: (...args: T) => Promise<R>,
	requiredChainId: number = config.CHAIN_ID
): ((...args: T) => Promise<R>) => {
	const {externalProvider} = useContext(AuthContext)
	const {open} = useContext(MetamaskWarnModalContext)

	return async (...args) => {
		if (!externalProvider) {
			throw new Error("No wallet connected")
		}
		const isRinkeby = requiredChainId === 4
		try {
			await externalProvider.request!({
				method: "wallet_switchEthereumChain",
				params: [
					{
						// TODO: revisit this part when we will be supporting more networks
						chainId: isRinkeby ? "0x4" : BigNumber.from(requiredChainId).toHexString()
					}
				]
			})
		} catch (e) {
			open()
			throw e
		}
		return func(...args)
	}
}

export default useCheckNetwork
