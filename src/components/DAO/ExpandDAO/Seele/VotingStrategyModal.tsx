import {FunctionComponent} from "react"
import {SeeleVotingStrategy} from "../../../../types/seele"
import Modal from "../../../Modals/Modal"
import {VOTING_STRATEGIES_CONTENT} from "./VotingStrategyCard"

const VotingStrategyModal: FunctionComponent<{
	show: boolean
	onClose: () => void
	votingStrategy?: SeeleVotingStrategy
}> = ({show, onClose, votingStrategy}) => {
	const {title = ""} = votingStrategy ? VOTING_STRATEGIES_CONTENT[votingStrategy] : {}
	return (
		<Modal show={show} onClose={onClose}>
			<form className="voting-strategy-form">
				<h2>Deploy Strategy</h2>
				<h3>{title}</h3>
			</form>
		</Modal>
	)
}

export default VotingStrategyModal
