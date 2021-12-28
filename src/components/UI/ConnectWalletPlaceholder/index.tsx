import {FunctionComponent, useContext} from "react"
import {AuthContext} from "../../../context/AuthContext"
import Button from "../../Controls/Button"
import "./styles.scss"

const ConnectWalletPlaceholder: FunctionComponent = () => {
	const {connectWallet, connecting} = useContext(AuthContext)

	return (
		<div className="connect-wallet">
			<h2>Please connect wallet to proceed</h2>
			<Button disabled={connecting} onClick={connectWallet}>
				{connecting ? "Connecting..." : "Connect wallet"}
			</Button>
		</div>
	)
}

export default ConnectWalletPlaceholder
