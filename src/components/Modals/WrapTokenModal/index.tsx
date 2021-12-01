import {FunctionComponent} from "react"
import Input from "../../Controls/Input"
import Modal from "../Modal"

const WrapTokenModal: FunctionComponent<{
	mode: "wrap" | "unwrap"
	show: boolean
	onClose: () => void
	tokensHeld: number
	onSubmit: (tokensAmout: number) => void
}> = ({mode, show, onClose, tokensHeld}) => {
	const isWrap = mode === "wrap"
	const handleSubmit = () => {
		console.log("TODO: Handle wrapping/unwrapping token")
	}
	return (
		<Modal
			onSubmit={handleSubmit}
			submitButtonText="Submit"
			onClose={onClose}
			show={show}
			title={isWrap ? "Wrap Tokens" : "Unwrap Tokens"}
			warningMessage={`This request will incur a gas fee. If you would like to proceed, please click "Submit" below.`}
		>
			<label>Amount of Tokens You Hold: {tokensHeld}</label>
			<Input />
		</Modal>
	)
}

export default WrapTokenModal
