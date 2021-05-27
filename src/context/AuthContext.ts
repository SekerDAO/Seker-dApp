import {createContext, useContext, useEffect, useState} from "react"
import decode from "jwt-decode"
import EthersContext from "./EthersContext"
import firebase from "firebase"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

type AuthContext = {
	account: string | null
	connectWallet: () => void
	connected: boolean
	disconnect: () => void
	connecting: boolean
}

export const useAuth = (): AuthContext => {
	const [account, setAccount] = useState<string | null>(null)
	const [connected, setConnected] = useState(false)
	const [connecting, setConnecting] = useState(false)
	const {provider, signer} = useContext(EthersContext)

	const init = async () => {
		const accounts = await provider!.listAccounts()
		if (accounts[0]) {
			setAccount(accounts[0])
		}
	}
	useEffect(() => {
		if (provider && signer) {
			init()
		}
	}, [provider, signer])

	const connectWallet = async () => {
		if (!(provider && signer)) {
			window.open("https://metamask.io/", "blank")
			return
		}
		setConnecting(true)
		try {
			let currentAccount: string
			if (account) {
				currentAccount = account
			} else {
				const metamaskAccounts = await window.ethereum.request({method: "eth_requestAccounts"})
				setAccount(metamaskAccounts[0])
				currentAccount = metamaskAccounts[0]
			}
			const signature = await signer.signMessage(JSON.stringify({account: currentAccount, token: "tokenwalk"}))
			const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/auth`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					account: currentAccount,
					token: "tokenwalk",
					signature
				})
			})
			const json = await res.json()
			localStorage.setItem("tokenwalk_at", json.token)
			await firebase.auth().signInWithCustomToken(json.token)
			setConnected(true)
		} catch (e) {
			console.error(e)
		}
		setConnecting(false)
	}

	const checkToken = async () => {
		const token = localStorage.getItem("tokenwalk_at")
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
	useEffect(() => {
		checkToken()
	}, [])

	const disconnect = () => {
		localStorage.removeItem("tokenwalk_at")
		setConnected(false)
	}

	return {
		account,
		connected,
		connectWallet,
		disconnect,
		connecting
	}
}

export const AuthContext = createContext<AuthContext>(({} as unknown) as AuthContext)
