import React, {FunctionComponent} from "react"
import "./styles.scss"

const Modal: FunctionComponent<{
	hideModal: boolean
	toggleModal: () => void
}> = ({hideModal, toggleModal, children}) => {
	if (hideModal) return null

	return (
		<>
			<div className="modalOverlay" onClick={() => toggleModal()} />,
			<div className="modalWrap">
				<div className="modal">{children}</div>
			</div>
		</>
	)
}

export default Modal
