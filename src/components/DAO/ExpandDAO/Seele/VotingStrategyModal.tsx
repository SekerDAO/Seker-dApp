import {FunctionComponent} from "react"
import Modal from "../../../Modals/Modal"

const VotingStrategyModal: FunctionComponent<{show: boolean; onClose: () => void}> = ({
	show,
	onClose
}) => {
	return <Modal show={show} onClose={onClose}></Modal>
}

export default VotingStrategyModal
