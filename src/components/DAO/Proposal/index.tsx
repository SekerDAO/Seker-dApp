import {FunctionComponent, useMemo, useState} from "react"
import {useLocation} from "react-router-dom"
import {ReactComponent as DelegateTokenDefault} from "../../../assets/icons/delegate-token-default.svg"
import {ReactComponent as DelegateTokenDone} from "../../../assets/icons/delegate-token-done.svg"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"
import {ReactComponent as WrapTokenDefault} from "../../../assets/icons/wrap-token-default.svg"
import {ReactComponent as WrapTokenDone} from "../../../assets/icons/wrap-token-done.svg"
import useSafeProposal from "../../../hooks/getters/useSafeProposal"
import useStrategyProposal from "../../../hooks/getters/useStrategyProposal"
import {formatReadableAddress} from "../../../utlls"
import Button from "../../Controls/Button"
import DelegateTokenModal from "../../Modals/DelegateTokenModal"
import WrapTokenModal from "../../Modals/WrapTokenModal"
import useSignSafeProposal from "../../Proposal/hooks/useSignSafeProposal"
import Copy from "../../UI/Copy"
import Divider from "../../UI/Divider"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Loader"
import {toastWarning} from "../../UI/Toast"
import ProposalLayout from "./ProposalLayout"
import "./styles.scss"

const MOCK_ADDRESS = "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D"

const SafeProposalContent: FunctionComponent<{id: string}> = ({id}) => {
	const {proposal, loading, error, canSign} = useSafeProposal(id)
	const {sign, processing} = useSignSafeProposal({proposal, canSign, id})

	if (loading || !proposal) return <Loader />
	if (error) return <ErrorPlaceholder />

	return (
		<ProposalLayout
			proposal={proposal}
			votingStrategy="admin"
			votesThreshold={proposal.gnosisVotingThreshold}
		>
			<Button
				disabled={!canSign || processing}
				onClick={sign}
				extraClassName="proposal__content-vote-button"
			>
				Sign
			</Button>
			<div className="proposal__content-participate-warning">
				<div>
					<WarningIcon width="20px" height="20px" />
				</div>
				<p>
					{`This request will incur a gas fee. If you would like to proceed, please
												click "Confirm".`}
				</p>
			</div>
		</ProposalLayout>
	)
}

const StrategyProposalContent: FunctionComponent<{id: string}> = ({id}) => {
	const {proposal, loading, error} = useStrategyProposal(id)
	const [showWrapModal, setShowWrapModal] = useState(false)
	const [showDelegateModal, setShowDelegateModal] = useState(false)
	const [tokensWrapped, setTokensWrapped] = useState(false)
	const [voteDelegated, setVoteDelegated] = useState(false)

	if (loading || !proposal) return <Loader />
	if (error) return <ErrorPlaceholder />

	const handleWrapToken = () => {
		console.log("TODO")
		setTokensWrapped(prevState => !prevState)
		setShowWrapModal(false)
	}

	const handleDelegateVote = () => {
		console.log("TODO")
		setVoteDelegated(true)
		setShowDelegateModal(false)
	}

	return (
		<>
			<WrapTokenModal
				tokensHeld={100}
				mode={tokensWrapped ? "unwrap" : "wrap"}
				show={showWrapModal}
				onSubmit={handleWrapToken}
				onClose={() => {
					setShowWrapModal(false)
				}}
			/>
			<DelegateTokenModal
				show={showDelegateModal}
				onClose={() => {
					setShowDelegateModal(false)
				}}
				onSubmit={handleDelegateVote}
			/>
			<ProposalLayout
				proposal={proposal}
				votesThreshold={100}
				votingStrategy={proposal.strategyType}
			>
				<div className="proposal__content-participate-container">
					<div>
						{tokensWrapped ? (
							<WrapTokenDone
								width="50px"
								height="50px"
								onClick={() => {
									setShowWrapModal(true)
								}}
							/>
						) : (
							<WrapTokenDefault
								width="50px"
								height="50px"
								onClick={() => {
									setShowWrapModal(true)
								}}
							/>
						)}
					</div>
					<div className="proposal__content-participate-step">
						<h3>Step 1: Wrap Tokens</h3>
						{tokensWrapped ? (
							<>
								<p>Wrapped Token Address</p>
								<Copy value="TODO: Add real token address here">
									{formatReadableAddress(MOCK_ADDRESS)}
								</Copy>
								<Button
									buttonType="link"
									onClick={() => {
										setShowWrapModal(true)
									}}
								>
									Unwrap Tokens
								</Button>
							</>
						) : (
							<p>
								Ensure your ERC-20 tokens follow the OpenZeppelin ERC-20 Voting Token Standard in
								order to vote.
							</p>
						)}
					</div>
				</div>
				<Divider />
				<div className="proposal__content-participate-container">
					<div>
						{voteDelegated ? (
							<DelegateTokenDone
								width="50px"
								height="50px"
								onClick={() => {
									setShowDelegateModal(true)
								}}
							/>
						) : (
							<DelegateTokenDefault
								width="50px"
								height="50px"
								onClick={
									tokensWrapped
										? () => {
												setShowDelegateModal(true)
										  }
										: () => toastWarning("First - you need to wrap your tokens. Follow step above.")
								}
								className={
									tokensWrapped ? undefined : "proposal__content-participate-icon--disabled"
								}
							/>
						)}
					</div>
					<div className="proposal__content-participate-step">
						<h3>Step 2: Delegate</h3>
						{voteDelegated ? (
							<>
								<p>Currently Delegated to</p>
								<Copy value="TODO: Add delegated user address here">
									{formatReadableAddress(MOCK_ADDRESS)}
								</Copy>
								<Button
									buttonType="link"
									onClick={() => {
										setShowDelegateModal(true)
									}}
								>
									Change Delegation
								</Button>
							</>
						) : (
							<p>Choose to delegate to yourself or another address.</p>
						)}
					</div>
				</div>
				<Divider />
				<Button
					disabled={!tokensWrapped || !voteDelegated}
					extraClassName="proposal__content-vote-button"
				>
					Vote
				</Button>
			</ProposalLayout>
		</>
	)
}

const Proposal: FunctionComponent = () => {
	const {search} = useLocation()
	const {id, type} = useMemo(() => {
		const params = new URLSearchParams(search)
		return {
			id: params.get("id"),
			type: params.get("type")
		}
	}, [search]) as {
		id: string
		type: string
	}

	return type === "safe" ? <SafeProposalContent id={id} /> : <StrategyProposalContent id={id} />
}

export default Proposal
