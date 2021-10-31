import {FunctionComponent} from "react"
import Button from "../../Controls/Button"
import Paper from "../../UI/Paper"
import {SeeleVotingStrategy} from "../../../types/seele"

const VotingStrategyCard: FunctionComponent<{
	votingStrategy: SeeleVotingStrategy
	title: string
	description: string
	onSelect: (votingStrategy: SeeleVotingStrategy) => void
}> = ({votingStrategy, title, description, onSelect}) => {
	return (
		<Paper className="voting-strategy-card">
			<h3>{title}</h3>
			<p>{description}</p>
			<Button buttonType="primary" onClick={() => onSelect(votingStrategy)}>
				Select
			</Button>
		</Paper>
	)
}

export default VotingStrategyCard
