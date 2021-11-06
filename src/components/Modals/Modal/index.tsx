import {FunctionComponent} from "react"
import "./styles.scss"
import {ReactComponent as CloseIcon} from "../../../assets/icons/delete.svg"
import Button from "../../Controls/Button"
import Divider from "../../UI/Divider"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"

const Modal: FunctionComponent<{
	show: boolean
	onClose: () => void
	title?: string
	submitButtonText?: string
	submitButtonDisabled?: boolean
	onSubmit?: () => void
	warningMessage?: string
}> = ({
	show,
	onClose,
	submitButtonText,
	title,
	onSubmit,
	warningMessage,
	children,
	submitButtonDisabled
}) => {
	if (!show) return null

	return (
		<>
			<div className="modal__overlay" onClick={onClose} />
			<div className="modal__body">
				<div className="modal__close" onClick={onClose}>
					<CloseIcon width="30px" height="30px" />
				</div>
				{title && <h2>{title}</h2>}
				{children}
				{warningMessage && (
					<>
						<Divider />
						<div className="modal__warning-message">
							<div>
								<WarningIcon width="20px" height="20px" />
							</div>
							<p>{warningMessage}</p>
						</div>
					</>
				)}
				{submitButtonText && (
					<div className="modal__footer">
						<Button onClick={onSubmit} disabled={submitButtonDisabled}>
							{submitButtonText}
						</Button>
					</div>
				)}
			</div>
		</>
	)
}

export default Modal
