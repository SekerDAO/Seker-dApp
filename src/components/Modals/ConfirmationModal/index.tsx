import React, {FunctionComponent, useState} from "react"
import Modal from "../Modal"
import Button from "../../Controls/Button"
import "./styles.scss"

const ConfirmationModal: FunctionComponent<{
	title: string
	text: string
	onSubmit: () => Promise<void>
	submitText: string
	cancelText?: string
	isOpened: boolean
	handleClose: () => void
}> = ({title, text, onSubmit, submitText, cancelText, isOpened, handleClose}) => {
	const [processing, setProcessing] = useState(false)

	const handleSubmit = async () => {
		setProcessing(true)
		await onSubmit()
		setProcessing(false)
		handleClose()
	}

	return (
		<Modal show={isOpened} onClose={handleClose}>
			<h2 className="confirmation-modal__title">{title}</h2>
			<p className="confirmation-modal__text">{text}</p>
			<div className="confirmation-modal__buttons">
				<Button buttonType="secondary" onClick={handleClose}>
					{cancelText ?? "Cancel"}
				</Button>
				<Button onClick={handleSubmit} disabled={processing}>
					{processing ? "Processing..." : submitText}
				</Button>
			</div>
		</Modal>
	)
}

export default ConfirmationModal
