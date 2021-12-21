import BurnerConnectProvider from "@burner-wallet/burner-connect-provider"
import {BigNumber} from "@ethersproject/bignumber"
import {ExternalProvider, JsonRpcSigner, Web3Provider} from "@ethersproject/providers"
// @ts-expect-error module doesn't have types
import MewConnect from "@myetherwallet/mewconnect-web-client"
import Torus from "@toruslabs/torus-embed"
import WalletConnectProvider from "@walletconnect/web3-provider"
import Authereum from "authereum"
// @ts-expect-error module doesn't have types
import ethProvider from "eth-provider"
import firebase from "firebase"
import decode from "jwt-decode"
import {createContext, useEffect, useState} from "react"
import Web3Modal, {connectors} from "web3modal"
import getUser from "../api/firebase/user/getUser"
import config from "../config"
import networks from "../constants/networks"

const providerOptions = {
	walletconnect: {
		package: WalletConnectProvider,
		options: {
			infuraId: config.INFURA_ID,
			network: networks[config.CHAIN_ID]
		}
	},
	torus: {
		package: Torus,
		options: {
			network: networks[config.CHAIN_ID],
			networkParams: {
				chainId: config.CHAIN_ID,
				host: networks[config.CHAIN_ID]
			}
		}
	},
	authereum: {
		package: Authereum
	},
	frame: {
		package: ethProvider
	},
	burnerconnect: {
		package: BurnerConnectProvider,
		options: {network: networks[config.CHAIN_ID]}
	},
	mewconnect: {
		package: MewConnect,
		options: {
			infuraId: config.INFURA_ID,
			network: networks[config.CHAIN_ID]
		}
	}
}

type AuthContext = {
	account: string | null
	balance: BigNumber | null
	url: string | null
	connectWallet: () => void
	connected: boolean
	disconnect: () => void
	connecting: boolean
	signer: JsonRpcSigner | null
	chainId: number | null
}

export const useAuth = (): AuthContext => {
	const [account, setAccount] = useState<string | null>(null)
	const [balance, setBalance] = useState<BigNumber | null>(null)
	const [connected, setConnected] = useState(false)
	const [connecting, setConnecting] = useState(false)
	const [chainId, setChainId] = useState<number | null>(null)
	const [signer, setSigner] = useState<JsonRpcSigner | null>(null)
	const [url, setUrl] = useState<string | null>(null)

	const setAccountData = async (
		connection: ExternalProvider
	): Promise<{account: string | null; signer: JsonRpcSigner | null}> => {
		const provider = new Web3Provider(connection)

		const currentChainId = (await provider.detectNetwork()).chainId
		setChainId(currentChainId)
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		;(connection as any).on("chainChanged", (network: string) => {
			setChainId(Number(network))
		})

		const accounts = await provider.listAccounts()
		const newAccount = accounts[0]?.toLowerCase() ?? null
		if (!newAccount) {
			return {
				signer: null,
				account: null
			}
		}
		setAccount(newAccount)
		const user = await getUser(newAccount)
		if (user?.url) {
			setUrl(user.url)
		}
		const newSigner = provider.getSigner()
		setSigner(newSigner)
		const newBalance = await newSigner.getBalance()
		setBalance(newBalance)

		return {account: newAccount, signer: newSigner}
	}

	const checkToken = async () => {
		const token = localStorage.getItem("hyphal_at")
		if (token) {
			try {
				const {exp} = decode<{exp: number}>(token)
				if (exp * 1000 - new Date().getTime() > 10) {
					await firebase.auth().signInWithCustomToken(token)
					setConnected(true)
				}
			} catch (e) {
				// do nothing
			}
		}
	}

	const init = async () => {
		let connection: ExternalProvider | undefined = undefined
		const {cachedProvider} = new Web3Modal({
			network: String(config.CHAIN_ID),
			cacheProvider: true,
			providerOptions
		})
		if (cachedProvider) {
			try {
				switch (cachedProvider) {
					case "injected":
						connection = await connectors.injected()
						break
					case "authereum":
						connection = (await connectors.authereum(
							providerOptions.authereum.package
						)) as ExternalProvider
						break
					case "walletconnect":
						connection = (await connectors.walletconnect(
							providerOptions.walletconnect.package,
							providerOptions.walletconnect.options
						)) as ExternalProvider
						break
					case "torus":
						connection = (await connectors.torus(
							providerOptions.torus.package,
							providerOptions.torus.options
						)) as ExternalProvider
						break
					case "frame":
						connection = await connectors.frame(providerOptions.frame.package)
						break
					case "burnerconnect":
						connection = await connectors.burnerconnect(
							providerOptions.burnerconnect.package,
							providerOptions.burnerconnect.options
						)
						break
					case "mewconnect":
						connection = (await connectors.mewconnect(
							providerOptions.mewconnect.package,
							providerOptions.mewconnect.options
						)) as ExternalProvider
				}
			} catch (e) {
				console.error(e)
			}
		}

		if (connection) {
			setAccountData(connection)
			checkToken()
		}
	}
	useEffect(() => {
		init()
	}, [])

	const connectWallet = async () => {
		setConnecting(true)
		try {
			const web3Modal = new Web3Modal({
				network: String(config.CHAIN_ID),
				cacheProvider: true,
				providerOptions
			})
			const connection = await web3Modal.connect()
			const {signer: newSigner, account: newAccount} = await setAccountData(connection)
			if (!(newSigner && newAccount)) {
				console.error("Unsuccessful connection attempt")
				return
			}

			const signature = await newSigner.signMessage(
				JSON.stringify({account: newAccount, token: "hyphal"})
			)
			const res = await fetch(`${config.CLOUD_FUNCTIONS_URL}/auth`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					account: newAccount,
					token: "hyphal",
					signature
				})
			})
			const json = await res.json()
			localStorage.setItem("hyphal_at", json.token)
			await firebase.auth().signInWithCustomToken(json.token)
			setConnected(true)
		} catch (e) {
			console.error(e)
		}
		setConnecting(false)
	}

	const disconnect = () => {
		localStorage.removeItem("hyphal_at")
		localStorage.removeItem("WEB3_CONNECT_CACHED_PROVIDER")
		setConnected(false)
	}

	return {
		account,
		balance,
		url,
		connected,
		connectWallet,
		disconnect,
		connecting,
		signer,
		chainId
	}
}

export const AuthContext = createContext<AuthContext>({} as unknown as AuthContext)
