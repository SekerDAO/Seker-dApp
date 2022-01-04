import {FunctionComponent} from "react"
import {ReactComponent as UsulSmall} from "../../../assets/icons/usul-small.svg"
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
		{dao.usulAddress && (
			<div className="about-dao__enabled-modules">
				<h2>Enabled Modules</h2>
				<Expandable
					title={
						<div className="about-dao__enabled-module">
							<div className="about-dao__enabled-module-icon">
								<UsulSmall width="100px" height="100px" />
							</div>
							<div className="about-dao__enabled-module-name">
								<h2>Usul</h2>
								<p>Proposal Module</p>
							</div>
						</div>
					}
				>
					<ul className="about-dao__enabled-module-details">
						<li className="about-dao__enabled-module-details-header">
							<h3>Strategy Name</h3>
							<h3>Voting Period</h3>
							<h3>Quorum Threshold</h3>
							<h3>Membership Type</h3>
						</li>
						{dao.strategies.map(({address, name, votingPeriod, quorumThreshold}) => {
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
			</div>
		)}
	</section>
)

export default AboutDAO
