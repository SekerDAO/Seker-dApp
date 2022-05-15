import {FunctionComponent, useContext} from "react"
import metamaskScreenshotInstructionsSrc from "../../../assets/images/add_sokoltestnet_screenshot.png"
import {MetamaskWarnModalContext} from "../../../context/MetamaskWarnModalContext"
import Modal from "../Modal"
import "./styles.scss"

const MetamaskWarnModal: FunctionComponent = () => {
	const {modalOpened, close} = useContext(MetamaskWarnModalContext)

	return (
		<Modal
			show={modalOpened}
			onClose={close}
			title="Wrong / Missing Network"
			width={750}
			height={580}
			zIndex={10}
		>
			<div className="metamask-warning">
				<p>
					In order to proceed, please navigate to your crypto wallet extension and select the
					correct network. If you have not added the network you wish to continue on, follow the
					steps below:
				</p>
				<div className="metamask-warning__details">
					<h3>Add the Gnosis Chain on MetaMask</h3>
					<div className="metamask-warning__details-settings">
						<p>
							<b>Step 1:</b> <br />
							Open up MetaMask. Under the network dropdown at the top, click on {"Add Network"}.
						</p>
						<p>
							<b>Step 2:</b>
							<br /> Complete the form with the following information and click {"Save"}:
						</p>
						<ul>
							<li>
								<b>Network Name:</b> Gnosis Chain (formerly xDai)
							</li>
							<li>
								<b>New RPC URL:</b> https://rpc.gnosischain.com
							</li>
							<li>
								<b>Chain ID:</b> 100
							</li>
							<li>
								<b>Currency Symbol:</b> xDAI
							</li>
							<li>
								<b>Block Explorer URL:</b> https://blockscout.com/poa/sokol
							</li>
						</ul>
					</div>
					<div className="metamask-warning__details-screenshot">
						<img
							src={metamaskScreenshotInstructionsSrc}
							alt="Metamask settings instructions screenshot"
							width={325}
							height={290}
						/>
					</div>
				</div>
			</div>
		</Modal>
	)
}

export default MetamaskWarnModal
