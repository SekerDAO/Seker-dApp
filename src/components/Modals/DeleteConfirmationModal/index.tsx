import {FunctionComponent, useState} from "react"
import Modal from "../Modal"
import Button from "../../Controls/Button"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"
import "./styles.scss"

const ConfirmationModal: FunctionComponent<{
	title: string
	text: string
	onDelete: () => Promise<void>
	isOpened: boolean
	handleClose: () => void
}> = ({title, text, onDelete, isOpened, handleClose}) => {
	const [processing, setProcessing] = useState(false)

	const handleDelete = async () => {
		setProcessing(true)
		await onDelete()
		setProcessing(false)
		handleClose()
	}

	return (
		<Modal show={isOpened} onClose={handleClose}>
			<h2 className="confirmation-modal__title">{title}</h2>
			<p className="confirmation-modal__text">{text}</p>
			<div className="modal-footer">
				<p className="footer-note">
					<WarningIcon width={30} height={30} />
					This request will incur a gas fee. If you would like to proceed, please click
					&ldquo;Submit&rsquo; below.
				</p>
			</div>
			<Button onClick={handleDelete} disabled={processing}>
				{processing ? "Processing..." : "Delete"}
			</Button>
		</Modal>
	)
}

export default ConfirmationModal
