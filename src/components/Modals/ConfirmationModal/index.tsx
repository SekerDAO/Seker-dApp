import {FunctionComponent, useState} from "react"
import Modal from "../Modal"

const ConfirmationModal: FunctionComponent<{
	title: string
	text: string
	warningText?: string
	onSubmit?: () => Promise<void>
	submitText?: string
	cancelText?: string
	isOpened: boolean
	handleClose: () => void
}> = ({title, text, warningText, onSubmit, submitText, isOpened, handleClose}) => {
	const [processing, setProcessing] = useState(false)

	const handleSubmit = async () => {
		if (onSubmit) {
			setProcessing(true)
			await onSubmit()
			setProcessing(false)
			handleClose()
		}
	}

	return (
		<Modal
			show={isOpened}
			onClose={handleClose}
			title={title}
			warningMessage={warningText}
			submitButtonText={processing ? "Processing..." : submitText}
			submitButtonDisabled={processing}
			onSubmit={onSubmit ? handleSubmit : undefined}
		>
			<p className="confirmation-modal__text">{text}</p>
		</Modal>
	)
}

export default ConfirmationModal
