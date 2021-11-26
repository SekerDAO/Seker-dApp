import {DAO} from "../../../types/DAO"
import {formatReadableAddress} from "../../../utlls"
import Button from "../../Controls/Button"
import Paper from "../../UI/Paper"
import "./styles.scss"
import {FunctionComponent} from "react"

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
				{dao.tokenSymbol && (
					<Paper>
						<h3>ERC-20 Token</h3>
						<span>{dao.tokenSymbol}</span>
					</Paper>
				)}
			</div>
			{/* TODO: Add Enabled Modules */}
		</div>
	</section>
)

export default AboutDAO
