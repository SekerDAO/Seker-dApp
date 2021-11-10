import {FunctionComponent} from "react"
import Paper from "../Paper"
import "./styles.scss"

const VotingStrategyCard: FunctionComponent<{
	title: string
	description: string
	image: string
	onClick: () => void
}> = ({title, description, image, onClick}) => (
	<div className="voting-strategy-card" onClick={onClick}>
		<div className="voting-strategy-card__inner">
			<div className="voting-strategy-card__front">
				<img src={image} alt={title} />
			</div>
			<Paper className="voting-strategy-card__back">
				<p>{description}</p>
			</Paper>
		</div>
	</div>
)

export default VotingStrategyCard
