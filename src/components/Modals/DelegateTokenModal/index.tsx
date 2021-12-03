import {FunctionComponent, useState} from "react"
import Input from "../../Controls/Input"
import Modal from "../Modal"

const DelegateTokenModal: FunctionComponent<{
	show: boolean
	onClose: () => void
	onSubmit: (delegateesAddress: string) => void
}> = ({show, onClose, onSubmit}) => {
	const [delegateesAddress, setDelegateesAddress] = useState("")

	const handleSubmit = () => {
		onSubmit(delegateesAddress)
	}

	return (
		<Modal
			onSubmit={handleSubmit}
			submitButtonText="Submit"
			onClose={onClose}
			show={show}
			title="Delegate"
			warningMessage={`This request will incur a gas fee. If you would like to proceed, please click "Submit" below.`}
		>
			<label htmlFor="delegatees-address">{`Delegatee's Address`}</label>
			<Input
				value={delegateesAddress}
				onChange={e => setDelegateesAddress(e.target.value)}
				id="delegatees-address"
			/>
		</Modal>
	)
}

export default DelegateTokenModal
