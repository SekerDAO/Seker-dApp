import {Fragment, FunctionComponent, useContext, useState} from "react"
import {ReactComponent as ExitIcon} from "../../../assets/icons/SekerDAO_Module_Exit_Inactive.svg"
import {ReactComponent as UsulIcon} from "../../../assets/icons/SekerDAO_Module_Usul.svg"
import {ReactComponent as GnosisSafeIcon} from "../../../assets/icons/gnosis-safe.svg"
import config from "../../../config"
import networks, {NETWORK_LOGOS} from "../../../constants/networks"
import {AuthContext} from "../../../context/AuthContext"
import {Usul, UsulDeployType} from "../../../types/DAO"
import Button from "../../Controls/Button"
import DeployUsulTypeModal from "../../Modals/DeployUsulTypeModal"
import ConnectWalletPlaceholder from "../../UI/ConnectWalletPlaceholder"
import DeployUsul from "./DeployUsul"
import ExpandDaoLayout from "./ExpandDaoLayout"
import UsulStrategiesList from "./UsulStrategiesList"
import "./styles.scss"

const DESCRIPTION =
	"Modules are your way of customizing, upgrading, and expanding your DAO. Here you can choose to swap voting strategies, add multiple strategies, or remove a strategy at any time. You can also introduce the Zodiac modules Bridge (for a constellation of voting strategies across chains), Exit (for a Moloch-style rage quit assigned to different asset holders), or Photon (a way to enact governance at the speed of light — coming soon)."
const USUL_DESCRIPTION = "Enables DAOs to choose from various on-chain voting methods."
const EXIT_MODULE_DESCRIPTION =
	"Enables participants to redeem a designated token for a proportional share of this account's digital assets."

const ExpandDAO: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterDeployUsul: () => void
	isAdmin: boolean
	usuls: Usul[]
}> = ({isAdmin, gnosisAddress, gnosisVotingThreshold, afterDeployUsul, usuls}) => {
	const [stage, setStage] = useState<"choose" | UsulDeployType | "bridge">("choose")
	const [deployTypeModalOpened, setDeployTypeModalOpened] = useState(false)
	const {connected} = useContext(AuthContext)

	if (!connected) {
		return <ConnectWalletPlaceholder />
	}

	const handleSelectUsulType = (type: UsulDeployType) => {
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
										onClick={() => {
											setDeployTypeModalOpened(true)
										}}
									>
										{usuls.length > 0 ? "Add New" : "Get Started"}
									</Button>
								</div>
								<div className="expand-dao__module">
									<ExitIcon />
									<h2>Exit Module</h2>
									<p>{EXIT_MODULE_DESCRIPTION}</p>
									<Button disabled>Get Started</Button>
								</div>
							</div>
							<div className="expand-dao__daos">
								{usuls.map((usul, index) => {
									const primaryNetLogo = NETWORK_LOGOS[networks[config.CHAIN_ID]] ?? (
										<div className="expand-dao__network">{networks[config.CHAIN_ID]}</div>
									)
									const sideNetLogo = NETWORK_LOGOS[networks[config.SIDE_CHAIN_ID]] ?? (
										<div className="expand-dao__network">{networks[config.SIDE_CHAIN_ID]}</div>
									)
									return (
										<Fragment key={index}>
											<div className="expand-dao__usul">
												<div className="expand-dao__usul-network">
													<img
														width={120}
														height={120}
														src={usul.deployType === "usulMulti" ? sideNetLogo : primaryNetLogo}
													/>
													<Button
														onClick={() => {
															console.log("TODO")
														}}
													>
														Add Strategy
													</Button>
												</div>
												<UsulStrategiesList strategies={usul.strategies} />
											</div>
											{index !== usuls.length - 1 && <div className="expand-dao__separator" />}
										</Fragment>
									)
								})}
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
						deployType={stage as UsulDeployType}
					/>
				)}
			</section>
		</>
	)
}

export default ExpandDAO
