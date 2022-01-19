import {FunctionComponent, useContext, useState} from "react"
import {ReactComponent as GnosisSafeIcon} from "../../../assets/icons/gnosis-safe.svg"
import {ReactComponent as UsulIcon} from "../../../assets/icons/usul-default.svg"
import {AuthContext} from "../../../context/AuthContext"
import Button from "../../Controls/Button"
import DeployUsulTypeModal from "../../Modals/DeployUsulTypeModal"
import ConnectWalletPlaceholder from "../../UI/ConnectWalletPlaceholder"
import DeployUsul from "./DeployUsul"
import ExpandDaoLayout from "./ExpandDaoLayout"
import "./styles.scss"

const DESCRIPTION =
	"Modules are your way of customizing, upgrading, and expanding your DAO. Here you can choose to swap voting strategies, add multiple strategies, or remove a strategy at any time. You can also introduce the Zodiac modules Bridge (for a constellation of voting strategies across chains), Exit (for a Moloch-style rage quit assigned to different asset holders), or Photon (a way to enact governance at the speed of light — coming soon)."
const USUL_DESCRIPTION = "Enables DAOs to choose from various on-chain voting methods."
const EXIT_MODULE_DESCRIPTION =
	"Enables participants to redeem a designated token for a proportional share of this account's digital assets."

const ExpandDAO: FunctionComponent<{
	gnosisAddress: string
	usulAddress?: string
	gnosisVotingThreshold: number
	afterDeployUsul: () => void
	isAdmin: boolean
}> = ({isAdmin, gnosisAddress, usulAddress, gnosisVotingThreshold, afterDeployUsul}) => {
	const [stage, setStage] = useState<"choose" | "usulSingle" | "usulMulti" | "bridge">("choose")
	const [deployTypeModalOpened, setDeployTypeModalOpened] = useState(false)
	const {connected} = useContext(AuthContext)

	if (!connected) {
		return <ConnectWalletPlaceholder />
	}

	// TODO: if side chain is not added to metamask, the error will be thrown on the next stage.
	// We should check it and display instruction for the user
	const handleSelectUsulType = (type: "usulSingle" | "usulMulti") => {
		setStage(type)
		setDeployTypeModalOpened(false)
	}

	return (
		<>
			<DeployUsulTypeModal
				isOpened={deployTypeModalOpened}
				onClose={() => {
					setDeployTypeModalOpened(false)
				}}
				onSubmit={handleSelectUsulType}
			/>
			<section className="expand-dao">
				{stage === "choose" && (
					<ExpandDaoLayout title="Expand DAO" description={DESCRIPTION}>
						<div className="expand-dao__main">
							<div className="expand-dao__title">
								<GnosisSafeIcon />
								Gnosis Safe
							</div>
							<div className="expand-dao__modules">
								<div className="expand-dao__module">
									<UsulIcon />
									<h2>Usul Module</h2>
									<p>{USUL_DESCRIPTION}</p>
									<Button
										disabled={!!usulAddress}
										onClick={() => {
											setDeployTypeModalOpened(true)
										}}
									>
										{usulAddress ? "Already deployed" : "Get Started"}
									</Button>
								</div>
								<div className="expand-dao__module">
									<UsulIcon />
									<h2>Exit Module</h2>
									<p>{EXIT_MODULE_DESCRIPTION}</p>
									<Button
										onClick={() => {
											console.log("TODO")
										}}
									>
										Get Started
									</Button>
								</div>
							</div>
						</div>
					</ExpandDaoLayout>
				)}
				{["usulSingle", "usulMulti"].includes(stage) && (
					<DeployUsul
						isAdmin={isAdmin}
						gnosisAddress={gnosisAddress}
						gnosisVotingThreshold={gnosisVotingThreshold}
						afterDeploy={afterDeployUsul}
						deployType={stage as "usulSingle"}
					/>
				)}
			</section>
		</>
	)
}

export default ExpandDAO
