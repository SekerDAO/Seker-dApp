import {FunctionComponent} from "react"
import {ReactComponent as UsulSmall} from "../../../assets/icons/SekerDAO_Module_Usul.svg"
import config from "../../../config"
import networks, {NETWORK_LOGOS_SMALL} from "../../../constants/networks"
import {VOTING_STRATEGIES} from "../../../constants/votingStrategies"
import {DAO} from "../../../types/DAO"
import {formatReadableAddress} from "../../../utlls"
import Button from "../../Controls/Button"
import Expandable from "../../UI/Expandable"
import Paper from "../../UI/Paper"
import "./styles.scss"

const AboutDAO: FunctionComponent<{
	dao: DAO
}> = ({dao}) => (
	<section className="about-dao">
		<div className="about-dao__balance">
			<div className="about-dao__balance-summary">
				<h3>DAO Treasury</h3>
				<p>$ TODO</p>
			</div>
			<Button buttonType="primary" onClick={() => console.log("TODO: Implement me")}>
				View Assets
			</Button>
		</div>
		<div className="about-dao__info">
			{dao.description && (
				<div className="about-dao__description">
					<h2>About</h2>
					<Paper>
						<p>{dao.description}</p>
					</Paper>
				</div>
			)}
			<div className="about-dao__parameters">
				<Paper>
					<h3>DAO Contract</h3>
					<span>{formatReadableAddress(dao.gnosisAddress)}</span>
				</Paper>
			</div>
		</div>
		<div className="about-dao__enabled-modules">
			<h2>Enabled Modules</h2>
			{dao.usuls.map((usul, index) => (
				<Expandable
					key={index}
					title={
						<>
							<div className="about-dao__enabled-module">
								<div className="about-dao__enabled-module-icon">
									<UsulSmall width="60px" height="60px" />
								</div>
								<div className="about-dao__enabled-module-name">
									<h2>Usul</h2>
									<p>Proposal Module</p>
								</div>
							</div>
							<div className="about-dao__enabled-module-network">
								<img
									width={20}
									height={20}
									src={
										NETWORK_LOGOS_SMALL[
											networks[
												config[usul.deployType === "usulMulti" ? "SIDE_CHAIN_ID" : "CHAIN_ID"]
											]
										]
									}
								/>
								{networks[config[usul.deployType === "usulMulti" ? "SIDE_CHAIN_ID" : "CHAIN_ID"]]}
							</div>
						</>
					}
				>
					<ul className="about-dao__enabled-module-details">
						<li className="about-dao__enabled-module-details-header">
							<h3>Strategy Name</h3>
							<h3>Voting Period</h3>
							<h3>Quorum Threshold</h3>
							<h3>Membership Type</h3>
						</li>
						{usul.strategies.map(({address, name, votingPeriod, quorumThreshold}) => {
							const content = VOTING_STRATEGIES.find(strategy => strategy.strategy === name)
							return (
								<li key={address} className="about-dao__enabled-module-details-item">
									<span>{content?.title}</span>
									<span>{votingPeriod} hours</span>
									<span>{quorumThreshold}% tokens</span>
									<span>Simple Membership</span>
								</li>
							)
						})}
					</ul>
				</Expandable>
			))}
		</div>
	</section>
)

export default AboutDAO
