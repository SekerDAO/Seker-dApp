import {FunctionComponent, useContext, useEffect, useMemo, useState} from "react"
import {useLocation} from "react-router-dom"
import {checkDelegatee} from "../../../api/ethers/functions/Usul/voting/votingApi"
import {ReactComponent as DelegateTokenDefault} from "../../../assets/icons/delegate-token-default.svg"
import {ReactComponent as DelegateTokenDone} from "../../../assets/icons/delegate-token-done.svg"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"
import {ReactComponent as WrapTokenDefault} from "../../../assets/icons/wrap-token-default.svg"
import {ReactComponent as WrapTokenDone} from "../../../assets/icons/wrap-token-done.svg"
import {AuthContext} from "../../../context/AuthContext"
import EthersContext from "../../../context/EthersContext"
import useSafeProposal from "../../../hooks/getters/useSafeProposal"
import useStrategyProposal from "../../../hooks/getters/useStrategyProposal"
import {formatReadableAddress} from "../../../utlls"
import Button from "../../Controls/Button"
import DelegateTokenModal from "../../Modals/DelegateTokenModal"
import VotingModal from "../../Modals/VotingModal"
import WrapTokenModal from "../../Modals/WrapTokenModal"
import useSignSafeProposal from "../../Proposal/hooks/useSignSafeProposal"
import Copy from "../../UI/Copy"
import Divider from "../../UI/Divider"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Loader"
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
	const {account, connected} = useContext(AuthContext)
	const {provider} = useContext(EthersContext)
	const {proposal, loading, error} = useStrategyProposal(id)
	const [showWrapModal, setShowWrapModal] = useState(false)
	const [showDelegateModal, setShowDelegateModal] = useState(false)
	const [showVotingModal, setShowVotingModal] = useState(false)
	const [tokensWrapped, setTokensWrapped] = useState(false) // TODO: temporary doesn't make sense
	const [delegatee, setDelegatee] = useState<string | null>(null)
	useEffect(() => {
		if (proposal?.govTokenAddress && account) {
			checkDelegatee(proposal.govTokenAddress, account, provider).then(res => {
				setDelegatee(res)
			})
		}
	}, [proposal, account])

	if (loading || !proposal) return <Loader />
	if (error) return <ErrorPlaceholder />

	const handleWrapToken = () => {
		console.log("TODO")
		setTokensWrapped(prevState => !prevState)
		setShowWrapModal(false)
	}

	const handleDelegateVote = (newDelegatee: string) => {
		setDelegatee(newDelegatee)
		setShowDelegateModal(false)
	}

	// TODO: add case when user has already voted
	const voteDisabled =
		!(connected && proposal.state === "active") || (!!proposal.govTokenAddress && !delegatee)

	return (
		<>
			<VotingModal
				show={showVotingModal}
				strategyAddress={proposal.strategyAddress}
				strategyName={proposal.strategyType}
				proposalId={proposal.id}
				afterSubmit={() => {
					setShowVotingModal(false)
				}}
				onClose={() => {
					setShowVotingModal(false)
				}}
			/>
			<WrapTokenModal
				tokensHeld={100}
				mode={tokensWrapped ? "unwrap" : "wrap"}
				show={showWrapModal}
				onSubmit={handleWrapToken}
				onClose={() => {
					setShowWrapModal(false)
				}}
			/>
			{showDelegateModal && proposal.govTokenAddress && account && (
				<DelegateTokenModal
					tokenAddress={proposal.govTokenAddress}
					onClose={() => {
						setShowDelegateModal(false)
					}}
					afterSubmit={handleDelegateVote}
					initialDelegatee={delegatee ?? account}
				/>
			)}
			<ProposalLayout
				proposal={proposal}
				votesThreshold={100}
				votingStrategy={proposal.strategyType}
			>
				{proposal.state === "active" ? (
					account && connected ? (
						<>
							{proposal.govTokenAddress && (
								<>
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
													Ensure your ERC-20 tokens follow the OpenZeppelin ERC-20 Voting Token
													Standard in order to vote.
												</p>
											)}
										</div>
									</div>
									<Divider />
									<div className="proposal__content-participate-container">
										<div>
											{delegatee ? (
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
													onClick={() => {
														setShowDelegateModal(true)
													}}
												/>
											)}
										</div>
										<div className="proposal__content-participate-step">
											<h3>Step 2: Delegate</h3>
											{delegatee ? (
												<>
													<p>Currently Delegated to</p>
													<Copy value={delegatee}>{formatReadableAddress(delegatee)}</Copy>
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
								</>
							)}
							<Button
								disabled={voteDisabled}
								extraClassName="proposal__content-vote-button"
								onClick={() => {
									setShowVotingModal(true)
								}}
							>
								Vote
							</Button>
						</>
					) : (
						<p>Please connect account</p>
					)
				) : (
					<p>TODO: add different texts for different non-active proposal states</p>
				)}
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
