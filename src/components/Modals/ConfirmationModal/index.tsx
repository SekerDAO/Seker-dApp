import {FunctionComponent, useState} from "react"
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
}> = ({title, text, onSubmit, submitText, cancelText, handleClose}) => {
	const [processing, setProcessing] = useState(false)

	const handleSubmit = async () => {
		setProcessing(true)
		await onSubmit()
		setProcessing(false)
		handleClose()
	}

	return (
		<>
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
		</>
	)
}

export default ConfirmationModal
