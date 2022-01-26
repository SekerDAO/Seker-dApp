import {FunctionComponent, useContext} from "react"
import MetamaskWarnModalContext from "../../../context/MetamaskWarnModalContext"
import Copy from "../../UI/Copy"
import Modal from "../Modal"
import "./styles.scss"

const MetamaskWarnModal: FunctionComponent = () => {
	const {modalOpened, close} = useContext(MetamaskWarnModalContext)

	return (
		<Modal show={modalOpened} onClose={close} title="Add chain to metamask">
			<div className="metamask-warning">
				<p>Please, add chain to metamask with the following params and reload the page:</p>
				<p>Chain ID: 77</p>
				<p>
					RPC endpoint: <Copy value="https://sokol.poa.network">https://sokol.poa.network</Copy>
				</p>
				<p>
					Block explorer (optional):{" "}
					<Copy value="https://blockscout.com/poa/sokol">https://blockscout.com/poa/sokol</Copy>
				</p>
			</div>
		</Modal>
	)
}

export default MetamaskWarnModal
