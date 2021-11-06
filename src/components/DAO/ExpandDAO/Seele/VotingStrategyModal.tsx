import {FunctionComponent} from "react"
import {SeeleVotingStrategy} from "../../../../types/seele"
import Button from "../../../Controls/Button"
import Input from "../../../Controls/Input"
import Modal from "../../../Modals/Modal"
import {VOTING_STRATEGIES_CONTENT} from "./VotingStrategyCard"

const VotingStrategyModal: FunctionComponent<{
	show: boolean
	onClose: () => void
	votingStrategy?: SeeleVotingStrategy
}> = ({show, onClose, votingStrategy}) => {
	if (!votingStrategy) {
		return null
	}
	const {title} = VOTING_STRATEGIES_CONTENT[votingStrategy]
	return (
		<Modal show={show} onClose={onClose}>
			<form className="voting-strategy-form">
				<h2>Deploy Strategy</h2>
				<h3>{title}</h3>
				{votingStrategy !== "singleVotingSimpleMembership" && (
					<div className="voting-strategy-form__row">
						<label>ERC-20 Token Address</label>
						<Input name="erc20TokenAddress" />
					</div>
				)}
				<div className="voting-strategy-form__row">
					<div className="voting-strategy-form__col">
						<label></label>
						<Input />
					</div>
					<div className="voting-strategy-form__col"></div>
				</div>
				<Button type="submit">Submit</Button>
			</form>
		</Modal>
	)
}

export default VotingStrategyModal
