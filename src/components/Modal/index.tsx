import React, {FunctionComponent} from "react"
import "./styles.scss"

const Modal: FunctionComponent<{
	show: boolean
	onClose: () => void
}> = ({show, onClose, children}) => {
	if (!show) return null

	return (
		<>
			<div className="modal__overlay" onClick={onClose} />,
			<div className="modal__body">
				<div className="modal__close" onClick={onClose} />
				{children}
			</div>
		</>
	)
}

export default Modal
