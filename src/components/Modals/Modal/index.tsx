import {FunctionComponent} from "react"
import "./styles.scss"
import {ReactComponent as CloseIcon} from "../../../assets/icons/delete.svg"

const Modal: FunctionComponent<{
	show: boolean
	onClose: () => void
	zIndex?: number
	width?: number
}> = ({show, onClose, children, zIndex, width}) => {
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
					<CloseIcon />
				</div>
				{children}
			</div>
		</>
	)
}

export default Modal
