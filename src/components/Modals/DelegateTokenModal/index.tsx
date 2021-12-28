import {FunctionComponent, useContext, useState, useEffect} from "react"
import {getStrategyGovTokenAddress} from "../../../api/ethers/functions/Usul/voting/usulStrategies"
import {checkDelegatee, delegateVote} from "../../../api/ethers/functions/Usul/voting/votingApi"
import {AuthContext} from "../../../context/AuthContext"
import ProviderContext from "../../../context/ProviderContext"
import {VotingStrategy} from "../../../types/DAO"
import Input from "../../Controls/Input"
import RadioButton from "../../Controls/RadioButton"
import {toastError, toastSuccess} from "../../UI/Toast"
import Modal from "../Modal"
import "./styles.scss"

const DelegateTokenModal: FunctionComponent<{
	strategy: VotingStrategy
	onClose: () => void
}> = ({strategy, onClose}) => {
	const {signer, account} = useContext(AuthContext)
	const {provider} = useContext(ProviderContext)
	const [processing, setProcessing] = useState(false)
	const [delegateTo, setDelegateTo] = useState<"self" | "address">("self")
	const [delegateeAddress, setDelegateeAddress] = useState<string>()
	const [govTokenAddress, setGovTokenAddress] = useState<string>()

	useEffect(() => {
		getStrategyGovTokenAddress(strategy.address, provider).then(tokenAddress => {
			if (tokenAddress) {
				setGovTokenAddress(tokenAddress)
			}
		})
	}, [strategy.address])
	useEffect(() => {
		if (govTokenAddress && account) {
			checkDelegatee(govTokenAddress, account, provider).then(delegatee => {
				if (delegatee) {
					setDelegateeAddress(delegatee)
				}
			})
		}
	}, [strategy, account])
	const handleSubmit = async () => {
		if (!signer || !govTokenAddress || !account) return
		try {
			if (delegateTo === "self") {
				await delegateVote(govTokenAddress, account, signer)
			} else {
				if (delegateeAddress) {
					await delegateVote(govTokenAddress, delegateeAddress, signer)
				}
			}
			toastSuccess("Tokens successfully delegated")
		} catch (e) {
			console.error(e)
			toastError("Failed to delegate tokens")
		}
		setProcessing(false)
	}

	const submitButtonDisabled = processing || !signer || (delegateTo === "self" && !delegateeAddress)
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
				<div className="delegate-token-modal__form">
					<div className="delegate-token-modal__form-field">
						<RadioButton
							label="Delegate to Self"
							id="delegate-to-self"
							name="delegate-to"
							checked={delegateTo === "self"}
							onChange={() => setDelegateTo("self")}
						/>
					</div>
					<div className="delegate-token-modal__form-field">
						<RadioButton
							label="Delegate to an Address"
							id="delegate-to-address"
							name="delegate-to"
							checked={delegateTo === "address"}
							onChange={() => setDelegateTo("address")}
						/>
					</div>
					<Input
						value={delegateeAddress}
						onChange={e => setDelegateeAddress(e.target.value)}
						id="delegatees-address"
					/>
				</div>
			</div>
		</Modal>
	)
}

export default DelegateTokenModal
