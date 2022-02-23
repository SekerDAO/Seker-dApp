import {FunctionComponent, useEffect} from "react"
import {ReactComponent as CloseIcon} from "../../../assets/icons/delete.svg"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"
import Button from "../../Controls/Button"
import Divider from "../../UI/Divider"
import "./styles.scss"

const Modal: FunctionComponent<{
	show: boolean
	onClose: () => void
	zIndex?: number
	width?: number
	height?: number
	title?: string
	submitButtonText?: string
	submitButtonDisabled?: boolean
	onSubmit?: () => void
	warningMessages?: string[]
}> = ({
	zIndex,
	width,
	height,
	show,
	onClose,
	submitButtonText,
	title,
	onSubmit,
	warningMessages,
	children,
	submitButtonDisabled
}) => {
	const checkForModals = () => {
		if (document.getElementsByClassName("modal__overlay").length > 0) {
			document.body.classList.add("scroll-lock")
		} else {
			document.body.classList.remove("scroll-lock")
		}
	}
	useEffect(() => {
		checkForModals()
		return checkForModals
	})
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
					...(width ? {width: `${width}px`} : {}),
					...(height ? {height: `${height}px`} : {})
				}}
			>
				<div className="modal__close" onClick={onClose}>
					<CloseIcon width="30px" height="30px" />
				</div>
				{title && <h2>{title}</h2>}
				{children}
				{warningMessages && (
					<>
						<Divider />
						{warningMessages.map((warningMessage, index) => (
							<div className="modal__warning-message" key={warningMessage + index}>
								<div>
									<WarningIcon width="20px" height="20px" />
								</div>
								<p>{warningMessage}</p>
							</div>
						))}
					</>
				)}
				{onSubmit && (
					<div className="modal__footer">
						<Button onClick={onSubmit} disabled={submitButtonDisabled}>
							{submitButtonText ?? "Submit"}
						</Button>
					</div>
				)}
			</div>
		</>
	)
}

export default Modal
