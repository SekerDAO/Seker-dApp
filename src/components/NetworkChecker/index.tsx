import React, {FunctionComponent, useContext} from "react"
import EthersContext from "../../context/EthersContext"
const {REACT_APP_CHAIN_ID} = process.env

const NetworkChecker: FunctionComponent = () => {
	const {chainId} = useContext(EthersContext)

	if (chainId && chainId !== REACT_APP_CHAIN_ID) {
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
				Wrong network
			</div>
		)
	}

	return null
}

export default NetworkChecker
