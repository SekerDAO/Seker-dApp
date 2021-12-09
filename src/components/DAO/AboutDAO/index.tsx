import {FunctionComponent} from "react"
import {ReactComponent as UsulSmall} from "../../../assets/icons/usul-deployed.svg"
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
				<p>$ {dao.balance}</p>
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
								<UsulSmall width="60px" height="60px" />
							</div>
							<div className="about-dao__enabled-module-name">
								<h2>Usul</h2>
								<h3>Proposal Module</h3>
							</div>
						</div>
					}
				></Expandable>
			</div>
		)}
	</section>
)

export default AboutDAO
