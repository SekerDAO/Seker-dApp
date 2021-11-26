import {ReactComponent as CloseIcon} from "../../../assets/icons/delete.svg"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"
import Button from "../../Controls/Button"
import Divider from "../../UI/Divider"
import "./styles.scss"
import {FunctionComponent} from "react"

const Modal: FunctionComponent<{
	show: boolean
	onClose: () => void
	zIndex?: number
	width?: number
	title?: string
	submitButtonText?: string
	submitButtonDisabled?: boolean
	onSubmit?: () => void
	warningMessage?: string
}> = ({
	zIndex,
	width,
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
			<div
				className="modal__overlay"
				onClick={onClose}
				style={zIndex ? {zIndex: zIndex - 1} : undefined}
			/>
			<div
				className="modal__body"
				style={{
					...(zIndex ? {zIndex} : {}),
					...(width ? {width: `${width}px`} : {})
				}}
			>
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
