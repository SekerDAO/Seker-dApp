import {JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
import {createContext, useEffect, useState} from "react"

type EthersContext = {
	chainId: string | null
	provider: Web3Provider | null
	signer: JsonRpcSigner | null
}

export const useEthers = (): EthersContext => {
	const [chainId, setChainId] = useState<string | null>(null)
	const [provider, setProvider] = useState<Web3Provider | null>(null)
	const [signer, setSigner] = useState<JsonRpcSigner | null>(null)

	const initEthers = async () => {
		const newProvider = new Web3Provider(window.ethereum)
		setProvider(newProvider)
		const newSigner = newProvider.getSigner()
		setSigner(newSigner)
		const accounts = await newProvider.listAccounts()
		if (accounts[0]) {
			const currentChainId = await window.ethereum.request({method: "eth_chainId"})
			setChainId(currentChainId)
		}
		window.ethereum.on("chainChanged", (newChainId: string) => {
			setChainId(newChainId)
		})
	}
	useEffect(() => {
		if (window.ethereum) {
			initEthers()
		}
	}, [window.ethereum])

	return {
		chainId,
		provider,
		signer
	}
}

const EthersContext = createContext<EthersContext>({} as EthersContext)

export default EthersContext
