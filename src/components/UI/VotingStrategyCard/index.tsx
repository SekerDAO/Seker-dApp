import {FunctionComponent} from "react"
import Paper from "../Paper"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"
import "./styles.scss"

const VotingStrategyCard: FunctionComponent<{
	title: string
	description: string
	image: string
	onClick: () => void
	isActive?: boolean
}> = ({title, description, image, onClick, isActive = true}) => (
	<div className="voting-strategy-card" onClick={onClick}>
		<div className="voting-strategy-card__inner">
			<div className="voting-strategy-card__front">
				<img src={image} alt={title} />
			</div>
			<Paper className="voting-strategy-card__back">
				{isActive ? (
					<p>{description}</p>
				) : (
					<div className="voting-strategy-card__warning-message">
						<WarningIcon width="22px" height="22px" />
						<span>This Voting Strategy is not supported yet</span>
					</div>
				)}
			</Paper>
		</div>
	</div>
)

export default VotingStrategyCard
