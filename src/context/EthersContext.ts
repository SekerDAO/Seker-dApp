import {
	InfuraProvider,
	JsonRpcSigner,
	Web3Provider,
	JsonRpcProvider
} from "@ethersproject/providers"
import {createContext, useEffect, useRef, useState} from "react"
const {REACT_APP_INFURA_NETWORK, REACT_APP_INFURA_ID} = process.env

type EthersContext = {
	chainId: string | null
	provider: JsonRpcProvider
	signer: JsonRpcSigner | null
}

export const useEthers = (): EthersContext => {
	const [chainId, setChainId] = useState<string | null>(null)
	const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
	const provider = useRef(
		new InfuraProvider(REACT_APP_INFURA_NETWORK, {
			projectId: REACT_APP_INFURA_ID
		})
	)

	const initMetamask = async () => {
		const metamaskProvider = new Web3Provider(window.ethereum)
		const newSigner = metamaskProvider.getSigner()
		setSigner(newSigner)
		const currentChainId = await window.ethereum.request({method: "eth_chainId"})
		setChainId(currentChainId)
		window.ethereum.on("chainChanged", (newChainId: string) => {
			setChainId(newChainId)
		})
	}
	useEffect(() => {
		if (window.ethereum) {
			initMetamask()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [window.ethereum])

	return {
		chainId,
		provider: provider.current,
		signer
	}
}

const EthersContext = createContext<EthersContext>({} as EthersContext)

export default EthersContext
