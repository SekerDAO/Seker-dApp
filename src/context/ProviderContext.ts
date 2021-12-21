import {InfuraProvider, JsonRpcProvider} from "@ethersproject/providers"
import {createContext, useRef} from "react"
import config from "../config"

type ProviderContext = {
	provider: JsonRpcProvider
}

export const useProvider = (): ProviderContext => {
	const provider = useRef(
		new InfuraProvider(config.INFURA_NETWORK, {
			projectId: config.INFURA_ID
		})
	)

	return {
		provider: provider.current
	}
}

const ProviderContext = createContext<ProviderContext>({} as ProviderContext)

export default ProviderContext
