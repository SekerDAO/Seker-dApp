import {createContext, useEffect, useState} from "react"
import Web3 from "web3"
import decode from "jwt-decode"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

type AuthContext = {
	account: string | null
	chainId: number | null
	connectWallet: () => void
	connected: boolean
	disconnect: () => void
	connecting: boolean
}

export const useAuth = (): AuthContext => {
	const [account, setAccount] = useState<string | null>(null)
	const [chainId, setChainId] = useState<number | null>(null)
	const [connected, setConnected] = useState(false)
	const [connecting, setConnecting] = useState(false)

	const initWeb3 = async () => {
		window.web3 = new Web3(window.ethereum)
		const accounts = await window.web3.eth.getAccounts()
		if (accounts[0]) {
			setAccount(accounts[0])
			const currentChainId = await window.ethereum.request({method: "eth_chainId"})
			if (currentChainId) {
				setChainId(currentChainId)
			}
		}
	}
	useEffect(() => {
		if (window.ethereum) {
			initWeb3()
		}
	}, [window.ethereum])

	const connectWallet = async () => {
		if (!window.ethereum) {
			window.open("https://metamask.io/", "blank")
			return
		}
		setConnecting(true)
		const accounts = await window.ethereum.request({method: "eth_requestAccounts"})
		setAccount(accounts[0])
		const currentChainId = await window.ethereum.request({method: "eth_chainId"})
		setChainId(currentChainId)
		const signature = await window.web3.eth.personal.sign(
			JSON.stringify({account: accounts[0], token: "tokenwalk"}),
			accounts[0]
		)
		try {
			const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/auth`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					account: accounts[0],
					token: "tokenwalk",
					signature
				})
			})
			const json = await res.json()
			localStorage.setItem("tokenwalk_at", json.token)
			setConnected(true)
		} catch (e) {
			console.error(e)
		}
		setConnecting(false)
	}

	const checkToken = () => {
		const token = localStorage.getItem("tokenwalk_at")
		if (token) {
			try {
				const {exp} = decode<{exp: number}>(token)
				if (exp * 1000 - new Date().getTime() > 10) {
					setConnected(true)
				}
			} catch (e) {
				// do nothing
			}
		}
	}
	useEffect(checkToken, [])

	const disconnect = () => {
		localStorage.removeItem("tokenwalk_at")
		setConnected(false)
	}

	return {
		account,
		chainId,
		connected,
		connectWallet,
		disconnect,
		connecting
	}
}

export const AuthContext = createContext<AuthContext>(({} as unknown) as AuthContext)
