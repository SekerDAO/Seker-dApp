import {InfuraProvider, JsonRpcProvider} from "@ethersproject/providers"
import {createContext, FunctionComponent, useRef} from "react"
import config from "../config"
import networks from "../constants/networks"

type ProviderContext = {
	provider: JsonRpcProvider
	sideChainProvider: JsonRpcProvider
}

const useProvider = (): ProviderContext => {
	const provider = useRef(
		new InfuraProvider(networks[config.CHAIN_ID], {
			projectId: config.INFURA_ID
		})
	)
	const sideChainProvider = useRef(
		new JsonRpcProvider(
			`https://${networks[config.SIDE_CHAIN_ID]}.poa.network`,
			config.SIDE_CHAIN_ID
		)
	)

	return {
		provider: provider.current,
		sideChainProvider: sideChainProvider.current
	}
}

export const ProviderContext = createContext<ProviderContext>({} as ProviderContext)

export const ProviderProvider: FunctionComponent = ({children}) => {
	const provider = useProvider()

	return <ProviderContext.Provider value={provider}>{children}</ProviderContext.Provider>
}
