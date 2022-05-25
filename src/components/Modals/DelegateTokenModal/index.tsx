import {isAddress} from "@ethersproject/address"
import {FunctionComponent, useContext, useState} from "react"
import {delegateVote} from "../../../api/ethers/functions/Usul/voting/votingApi"
import config from "../../../config"
import {VOTING_STRATEGIES} from "../../../constants/votingStrategies"
import {AuthContext} from "../../../context/AuthContext"
import useGovToken from "../../../hooks/getters/useGovToken"
import useCheckNetwork from "../../../hooks/useCheckNetwork"
import {VotingStrategy} from "../../../types/DAO"
import {formatReadableAddress} from "../../../utlls"
import Input from "../../Controls/Input"
import RadioButton from "../../Controls/RadioButton"
import ConnectWalletPlaceholder from "../../UI/ConnectWalletPlaceholder"
import Copy from "../../UI/Copy"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Skeleton"
import {toastError, toastSuccess} from "../../UI/Toast"
import Modal from "../Modal"
import "./styles.scss"

const DelegateTokenModal: FunctionComponent<{
	strategy: VotingStrategy
	onClose: () => void
	sideChain: boolean
}> = ({strategy, onClose, sideChain}) => {
	const {signer, account, connected} = useContext(AuthContext)
	const [processing, setProcessing] = useState(false)
	const [delegateTo, setDelegateTo] = useState<"self" | "address">("self")
	const {
		govTokenAddress,
		delegateeAddress: initialDelegateeAddress,
		balance,
		loading,
		error
	} = useGovToken(strategy.address, sideChain)
	const [delegateeAddress, setDelegateeAddress] = useState<string>()

	const checkedDelegateVote = useCheckNetwork(
		delegateVote,
		sideChain ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)

	if (error) return <ErrorPlaceholder />

	const handleDelegateToChange = (newValue: "self" | "address") => {
		setDelegateTo(newValue)
	}

	const handleDelegateeAddressChange = (newValue: string) => {
		setDelegateeAddress(newValue)
	}

	const handleSubmit = async () => {
		if (!(signer && account && govTokenAddress)) return
		setProcessing(true)
		try {
			if (delegateTo === "self") {
				await checkedDelegateVote(govTokenAddress, account, signer)
			} else {
				if (delegateeAddress) {
					await checkedDelegateVote(govTokenAddress, delegateeAddress, signer)
				}
			}
			toastSuccess("Tokens successfully delegated")
			setProcessing(false)
			onClose()
		} catch (e) {
			console.error(e)
			toastError("Failed to delegate tokens")
			setProcessing(false)
		}
	}

	const submitButtonDisabled =
		processing ||
		!signer ||
		(delegateTo === "address" && !(delegateeAddress && isAddress(delegateeAddress)))

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
				{connected ? (
					<>
						<div className="delegate-token-modal__heading">
							<div className="delegate-token-modal__heading-row">
								<p>Voting Strategy</p>
								<Copy>
									{VOTING_STRATEGIES.find(s => s.strategy === strategy.name)?.title ??
										strategy.name}
								</Copy>
							</div>
							<div className="delegate-token-modal__heading-row">
								{loading ? (
									<Loader />
								) : (
									<>
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
											<Copy>{balance}</Copy>
										</div>
									</>
								)}
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
								validation={
									delegateTo === "self" || !delegateeAddress
										? null
										: isAddress(delegateeAddress)
										? null
										: "Not a valid address"
								}
								disabled={delegateTo === "self"}
								value={delegateeAddress ?? ""}
								onChange={e => handleDelegateeAddressChange(e.target.value)}
								id="delegatees-address"
							/>
						</div>
					</>
				) : (
					<ConnectWalletPlaceholder />
				)}
			</div>
		</Modal>
	)
}

export default DelegateTokenModal
