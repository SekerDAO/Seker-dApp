import {FunctionComponent, useState} from "react"
import Paper from "../../UI/Paper"
import Button from "../../Controls/Button"
import Modal from "../../Modals/Modal"
import VotesCardContent, {VotesCardContentProps} from "./VotesCardContent"
import "./styles.scss"

const VotesCard: FunctionComponent<VotesCardContentProps> = ({
	type,
	percentageValue,
	tokensValue,
	votes
}) => {
	const [showModal, setShowModal] = useState(false)
	const baseProps = {
		type,
		percentageValue,
		tokensValue
	}

	return (
		<Paper className="votes-card">
			<VotesCardContent votes={votes.slice(0, 3)} {...baseProps}>
				<Button buttonType="link" onClick={() => setShowModal(true)}>
					View More
				</Button>
			</VotesCardContent>
			<Modal show={showModal} onClose={() => setShowModal(false)}>
				<VotesCardContent votes={votes} {...baseProps}></VotesCardContent>
			</Modal>
		</Paper>
	)
}

export default VotesCard
