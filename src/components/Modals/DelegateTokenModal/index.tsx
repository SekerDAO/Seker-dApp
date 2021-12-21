import {FunctionComponent, useContext, useState} from "react"
import {delegateVote} from "../../../api/ethers/functions/Usul/voting/votingApi"
import {AuthContext} from "../../../context/AuthContext"
import Input from "../../Controls/Input"
import {toastError, toastSuccess} from "../../UI/Toast"
import Modal from "../Modal"
import "./styles.scss"

const DelegateTokenModal: FunctionComponent<{
	tokenAddress: string
	onClose: () => void
	afterSubmit: (delegateeAddress: string) => void
	initialDelegatee: string
}> = ({tokenAddress, onClose, afterSubmit, initialDelegatee}) => {
	const {signer} = useContext(AuthContext)
	const [processing, setProcessing] = useState(false)
	const [delegateeAddress, setDelegateeAddress] = useState(initialDelegatee)

	const handleSubmit = async () => {
		if (!(signer && delegateeAddress)) return
		try {
			await delegateVote(tokenAddress, delegateeAddress, signer)
			toastSuccess("Tokens successfully delegated")
			afterSubmit(delegateeAddress)
		} catch (e) {
			console.error(e)
			toastError("Failed to delegate tokens")
		}
		setProcessing(false)
	}

	return (
		<Modal
			onSubmit={handleSubmit}
			submitButtonText={processing ? "Processing..." : "Submit"}
			submitButtonDisabled={processing || !signer || !delegateeAddress}
			onClose={onClose}
			show
			title="Delegate"
			warningMessage={`This request will incur a gas fee. If you would like to proceed, please click "Submit" below.`}
		>
			<div className="delegate-token-modal">
				<label htmlFor="delegatees-address">{`Delegatee's Address`}</label>
				<Input
					value={delegateeAddress}
					onChange={e => setDelegateeAddress(e.target.value)}
					id="delegatees-address"
				/>
			</div>
		</Modal>
	)
}

export default DelegateTokenModal
