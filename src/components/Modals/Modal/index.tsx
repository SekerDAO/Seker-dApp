import React, {FunctionComponent, useContext, useMemo} from "react"
import {ModalContext} from "../../../context/ModalContext"
import CloseIcon from "../../../icons/CloseIcon"
import "./styles.scss"

const Modal: FunctionComponent = () => {
	const {overlay, setOverlay} = useContext(ModalContext)
	const toRender = useMemo(() => {
		if (overlay) {
			const lays = Object.values(overlay)
			return lays[0]
		}

		return null
	}, [overlay])

	if (!toRender) return null

	return (
		<>
			<div className="modal__overlay" onClick={() => setOverlay()} />
			<div className="modal__body">
				<div className="modal__close" onClick={() => setOverlay()}>
					<CloseIcon />
				</div>
				{toRender}
			</div>
		</>
	)
}

export default Modal
