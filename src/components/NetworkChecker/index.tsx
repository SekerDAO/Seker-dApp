import {FunctionComponent, useContext} from "react"
import config from "../../config"
import networks from "../../constants/networks"
import {AuthContext} from "../../context/AuthContext"

const NetworkChecker: FunctionComponent = () => {
	const {chainId} = useContext(AuthContext)

	if (chainId && chainId !== config.CHAIN_ID) {
		return (
			<div
				style={{
					position: "fixed",
					zIndex: 1000,
					width: "100vw",
					height: "100vh",
					backgroundColor: "white",
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				Wrong network: Please switch to {networks[config.CHAIN_ID]}
			</div>
		)
	}

	return null
}

export default NetworkChecker
