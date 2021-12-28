import {FunctionComponent} from "react"
import {VotingStrategy, VotingStrategyName} from "../../../types/DAO"
import {formatReadableAddress} from "../../../utlls"
import Input from "../../Controls/Input"
import RadioButton from "../../Controls/RadioButton"
import Copy from "../../UI/Copy"
import Modal from "../Modal"
import "./styles.scss"
import useDelegateTokenModal from "./useDelegateTokenModal"

const DelegateTokenModal: FunctionComponent<{
	strategy: VotingStrategy
	strategyContent?: {
		strategy: VotingStrategyName
		title: string
		description: string
		cardImage: string
		active: boolean
	}
	onClose: () => void
}> = ({strategy, strategyContent, onClose}) => {
	const {
		processing,
		handleSubmit,
		handleDelegateToChange,
		handleDelegateeAddressChange,
		submitButtonDisabled,
		delegateTo,
		delegateeAddress,
		initialDelegateeAddress
	} = useDelegateTokenModal(strategy)

	return (
		<Modal
			onSubmit={handleSubmit}
			submitButtonText={processing ? "Processing..." : "Submit"}
			submitButtonDisabled={submitButtonDisabled}
			onClose={onClose}
			show
			title="Delegate Vote"
			warningMessages={[
				"Current delegation applies to voting on all currently active proposals. New delegation will apply to voting on future proposals.",
				`This request will incur a gas fee. If you would like to proceed, please click "Submit" below.`
			]}
		>
			<div className="delegate-token-modal">
				<div className="delegate-token-modal__heading">
					<div className="delegate-token-modal__heading-row">
						<p>Voting Strategy</p>
						<Copy>{strategyContent?.title}</Copy>
					</div>
					<div className="delegate-token-modal__heading-row">
						<div className="delegate-token-modal__heading-col">
							<p>Currently Delegated to</p>
							<Copy value={initialDelegateeAddress}>
								{initialDelegateeAddress
									? formatReadableAddress(initialDelegateeAddress)
									: "Not Delegated yet"}
							</Copy>
						</div>
						<div className="delegate-token-modal__heading-col">
							<p>Amount of Voting Tokens</p>
							<Copy>100</Copy>
						</div>
					</div>
				</div>
				<div className="delegate-token-modal__form">
					<div className="delegate-token-modal__form-field">
						<RadioButton
							label="Delegate to Self"
							id="delegate-to-self"
							name="delegate-to"
							checked={delegateTo === "self"}
							onChange={() => handleDelegateToChange("self")}
						/>
					</div>
					<div className="delegate-token-modal__form-field">
						<RadioButton
							label="Delegate to an Address"
							id="delegate-to-address"
							name="delegate-to"
							checked={delegateTo === "address"}
							onChange={() => handleDelegateToChange("address")}
						/>
					</div>
					<Input
						value={delegateeAddress}
						onChange={e => handleDelegateeAddressChange(e.target.value)}
						id="delegatees-address"
					/>
				</div>
			</div>
		</Modal>
	)
}

export default DelegateTokenModal
