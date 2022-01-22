import {FunctionComponent, useState} from "react"
import {UsulDeployType} from "../../../types/DAO"
import RadioButton from "../../Controls/RadioButton"
import Modal from "../Modal"
import "./styles.scss"

const DeployUsulTypeModal: FunctionComponent<{
	isOpened: boolean
	onClose: () => void
	onSubmit: (type: UsulDeployType) => void
}> = ({isOpened, onClose, onSubmit}) => {
	const [type, setType] = useState<UsulDeployType>("usulSingle")
	return (
		<Modal
			show={isOpened}
			onClose={onClose}
			title="Select Usul Deployment Type"
			onSubmit={() => {
				onSubmit(type)
			}}
		>
			<div className="deploy-usul-type-modal">
				<p>TODO: some description here</p>
				<div className="deploy-usul-type-modal__input">
					<RadioButton
						label="Single Chain"
						id="deploy-usul-single"
						checked={type === "usulSingle"}
						onChange={() => {
							setType("usulSingle")
						}}
					/>
				</div>
				<div className="deploy-usul-type-modal__input">
					<RadioButton
						label="Multi Chain"
						id="deploy-usul-multi"
						checked={type === "usulMulti"}
						onChange={() => {
							setType("usulMulti")
						}}
					/>
				</div>
			</div>
		</Modal>
	)
}

export default DeployUsulTypeModal
