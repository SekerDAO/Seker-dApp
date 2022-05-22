import {Fragment, FunctionComponent, useState} from "react"
import {ReactComponent as ExitIcon} from "../../../../assets/icons/SekerDAO_Module_Exit_Inactive.svg"
import {ReactComponent as UsulIcon} from "../../../../assets/icons/SekerDAO_Module_Usul.svg"
import {ReactComponent as GnosisSafeIcon} from "../../../../assets/icons/gnosis-safe.svg"
import config from "../../../../config"
import networks, {NETWORK_LOGOS} from "../../../../constants/networks"
import {Usul} from "../../../../types/DAO"
import Button from "../../../Controls/Button"
import Divider from "../../../UI/Divider"
import ExpandDaoLayout from "../ExpandDaoLayout"
import UsulStrategiesList from "../UsulStrategiesList"

const DESCRIPTION =
	"Modules are your way of customizing, upgrading, and expanding your DAO. Here you can choose to swap voting strategies, add multiple strategies, or remove a strategy at any time. You can also introduce the Zodiac modules Bridge (for a constellation of voting strategies across chains), Exit (for a Moloch-style rage quit assigned to different asset holders), or Photon (a way to enact governance at the speed of light — coming soon)."
const USUL_DESCRIPTION = "Enables DAOs to choose from various on-chain voting methods."
const EXIT_MODULE_DESCRIPTION =
	"Enables participants to redeem a designated token for a proportional share of this account's digital assets."

const StartExpandDao: FunctionComponent<{
	usuls: Usul[]
	onDeployUsulClick: () => void
	onAddStrategiesClick: (usul: Usul) => void
}> = ({usuls, onDeployUsulClick, onAddStrategiesClick}) => {
	const [showDetails, setShowDetails] = useState(false)
	const hasUsul = usuls.length > 0
	return (
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
						<div className="expand-dao__module-buttons">
							{hasUsul && (
								<Button buttonType="secondary" onClick={() => setShowDetails(!showDetails)}>
									{showDetails ? "Hide Details" : "View Details"}
								</Button>
							)}
							<Button onClick={onDeployUsulClick}>{hasUsul ? "Add New" : "Get Started"}</Button>
						</div>
					</div>
					<div className="expand-dao__module">
						<ExitIcon />
						<h2>Exit Module</h2>
						<p>{EXIT_MODULE_DESCRIPTION}</p>
						<Button disabled>Get Started</Button>
					</div>
				</div>
				{showDetails && (
					<div className="expand-dao__usuls">
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
													onAddStrategiesClick(usul)
												}}
											>
												Add Strategy
											</Button>
										</div>
										<UsulStrategiesList strategies={usul.strategies} />
									</div>
									{index !== usuls.length - 1 && <Divider />}
								</Fragment>
							)
						})}
					</div>
				)}
			</div>
		</ExpandDaoLayout>
	)
}

export default StartExpandDao
