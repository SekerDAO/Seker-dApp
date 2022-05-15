import {BigNumber} from "@ethersproject/bignumber"
import {useContext} from "react"
import config from "../config"
import {AuthContext} from "../context/AuthContext"
import {MetamaskWarnModalContext} from "../context/MetamaskWarnModalContext"

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
		let requiredChainIdHex = BigNumber.from(requiredChainId).toHexString()
		if (requiredChainIdHex.startsWith("0x0")) {
			requiredChainIdHex = `0x${requiredChainIdHex.slice(3)}`
		}
		try {
			await externalProvider.request!({
				method: "wallet_switchEthereumChain",
				params: [
					{
						chainId: requiredChainIdHex
					}
				]
			})
		} catch (e) {
			if (requiredChainId === 100) {
				try {
					await externalProvider.request!({
						method: "wallet_addEthereumChain",
						params: [
							{
								chainId: requiredChainIdHex,
								chainName: "Gnosis Chain (formerly xDai)",
								nativeCurrency: {
									symbol: "xDAI",
									decimals: 18
								},
								rpcUrls: ["https://rpc.gnosischain.com"],
								blockExplorerUrls: ["https://blockscout.com/xdai/mainnet"]
							}
						]
					})
				} catch (err) {
					open()
					throw err
				}
			} else {
				open()
				throw e
			}
		}
		return func(...args)
	}
}

export default useCheckNetwork
