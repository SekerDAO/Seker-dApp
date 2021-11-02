import {FunctionComponent} from "react"
import "./styles.scss"
import CloseIcon from "../../../assets/icons/delete.svg"

const Modal: FunctionComponent<{
	show: boolean
	onClose: () => void
}> = ({show, onClose, children}) => {
	if (!show) return null

	return (
		<>
			<div className="modal__overlay" onClick={onClose} />
			<div className="modal__body">
				<div className="modal__close" onClick={onClose}>
					<img src={CloseIcon} alt="Close Modal" />
				</div>
				{children}
			</div>
		</>
	)
}

export default Modal
