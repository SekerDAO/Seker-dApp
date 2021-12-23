import {FunctionComponent, useContext, useState} from "react"
import {voteLinear} from "../../../api/ethers/functions/Usul/voting/OzLinearVoting/ozLinearVotingApi"
import {AuthContext} from "../../../context/AuthContext"
import {VotingStrategyName} from "../../../types/DAO"
import RadioButton from "../../Controls/RadioButton"
import {toastError} from "../../UI/Toast"
import Modal from "../Modal"

const VotingModal: FunctionComponent<{
	show: boolean
	strategyAddress: string
	strategyName: VotingStrategyName
	proposalId: number
	afterSubmit: () => void
	onClose: () => void
}> = ({show, afterSubmit, onClose, strategyAddress, strategyName, proposalId}) => {
	const {signer} = useContext(AuthContext)
	const [processing, setProcessing] = useState(false)
	const [vote, setVote] = useState<0 | 1 | 2 | null>(null)

	const handleVote = async () => {
		if (!signer || vote === null) return
		try {
			setProcessing(true)
			switch (strategyName) {
				case "linearVoting":
					await voteLinear(strategyAddress, proposalId, vote, signer)
					break
				default:
					throw new Error("Unsupported voting strategy")
			}
			afterSubmit()
		} catch (e) {
			console.error(e)
			toastError("Voting failed")
		}
		setProcessing(false)
	}

	return (
		<Modal
			show={show}
			onClose={onClose}
			submitButtonText={processing ? "Processing" : "Submit"}
			submitButtonDisabled={!signer || vote === null || processing}
			onSubmit={handleVote}
			warningMessage={`This request will incur a gas fee. If you would like to proceed, please click "Submit" below.`}
		>
			<RadioButton
				label="For"
				id="vote__for"
				checked={vote === 1}
				onChange={() => {
					setVote(1)
				}}
			/>
			<RadioButton
				label="Against"
				id="vote__against"
				checked={vote === 0}
				onChange={() => {
					setVote(0)
				}}
			/>
			<RadioButton
				label="Abstain"
				id="vote__abstain"
				checked={vote === 2}
				onChange={() => {
					setVote(2)
				}}
			/>
		</Modal>
	)
}

export default VotingModal
