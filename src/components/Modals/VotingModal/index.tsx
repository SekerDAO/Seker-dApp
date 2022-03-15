import {FunctionComponent, useContext, useState} from "react"
import {voteMemberLinear} from "../../../api/ethers/functions/Usul/voting/MemberLinearVoting/memberLinearVotingApi"
import {voteOzLinear} from "../../../api/ethers/functions/Usul/voting/OzLinearVoting/ozLinearVotingApi"
import {voteOzSingle} from "../../../api/ethers/functions/Usul/voting/OzSingleVoting/ozSingleVotingApi"
import config from "../../../config"
import {AuthContext} from "../../../context/AuthContext"
import useCheckNetwork from "../../../hooks/useCheckNetwork"
import {VotingStrategyName} from "../../../types/DAO"
import RadioButton from "../../Controls/RadioButton"
import {toastError} from "../../UI/Toast"
import Modal from "../Modal"
import "./styles.scss"

const VotingModal: FunctionComponent<{
	show: boolean
	strategyAddress: string
	strategyName: VotingStrategyName
	proposalId: number
	afterSubmit: () => void
	onClose: () => void
	sideChain: boolean
}> = ({show, afterSubmit, onClose, strategyAddress, strategyName, proposalId, sideChain}) => {
	const {signer} = useContext(AuthContext)
	const [processing, setProcessing] = useState(false)
	const [vote, setVote] = useState<0 | 1 | 2 | null>(null)

	const checkedVoteMemberLinear = useCheckNetwork(
		voteMemberLinear,
		sideChain ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)
	const checkedVoteOzLinear = useCheckNetwork(
		voteOzLinear,
		sideChain ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)
	const checkedVoteOzSingle = useCheckNetwork(
		voteOzSingle,
		sideChain ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)

	const handleVote = async () => {
		if (!signer || vote === null) return
		try {
			setProcessing(true)
			switch (strategyName) {
				case "linearVoting":
					await checkedVoteOzLinear(strategyAddress, proposalId, vote, signer)
					break
				case "singleVoting":
					await checkedVoteOzSingle(strategyAddress, proposalId, vote, signer)
					break
				case "linearVotingSimpleMembership":
					await checkedVoteMemberLinear(strategyAddress, proposalId, vote, signer)
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
			title="Vote"
			show={show}
			onClose={onClose}
			submitButtonText={processing ? "Processing" : "Submit"}
			submitButtonDisabled={!signer || vote === null || processing}
			onSubmit={handleVote}
			warningMessages={[
				`This request will incur a gas fee. If you would like to proceed, please click "Submit" below.`
			]}
		>
			<div className="vote-modal">
				<div className="vote-modal__input">
					<RadioButton
						label="For"
						id="vote__for"
						checked={vote === 1}
						onChange={() => {
							setVote(1)
						}}
					/>
				</div>
				<div className="vote-modal__input">
					<RadioButton
						label="Against"
						id="vote__against"
						checked={vote === 0}
						onChange={() => {
							setVote(0)
						}}
					/>
				</div>
				<div className="vote-modal__input">
					<RadioButton
						label="Abstain"
						id="vote__abstain"
						checked={vote === 2}
						onChange={() => {
							setVote(2)
						}}
					/>
				</div>
			</div>
		</Modal>
	)
}

export default VotingModal
