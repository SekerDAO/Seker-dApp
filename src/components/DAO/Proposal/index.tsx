import {Fragment, FunctionComponent, useContext, useMemo} from "react"
import {useLocation, useHistory} from "react-router-dom"
import {ReactComponent as DelegateTokenDefault} from "../../../assets/icons/delegate-token-default.svg"
import {ReactComponent as DelegateTokenDone} from "../../../assets/icons/delegate-token-done.svg"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"
import {ReactComponent as WrapTokenDefault} from "../../../assets/icons/wrap-token-default.svg"
import {ReactComponent as WrapTokenDone} from "../../../assets/icons/wrap-token-done.svg"
import {AuthContext} from "../../../context/AuthContext"
import useProposal from "../../../hooks/getters/useProposal"
import {formatReadableAddress} from "../../../utlls"
import Button from "../../Controls/Button"
import BackButton from "../../Controls/Button/BackButton"
import ConfirmationModal from "../../Modals/ConfirmationModal"
import DelegateTokenModal from "../../Modals/DelegateTokenModal"
import WrapTokenModal from "../../Modals/WrapTokenModal"
import useSignProposal from "../../Proposal/hooks/useSignProposal"
import Copy from "../../UI/Copy"
import Divider from "../../UI/Divider"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Expandable from "../../UI/Expandable"
import Loader from "../../UI/Loader"
import Paper from "../../UI/Paper"
import Tag from "../../UI/Tag"
import ProposalHeader from "./ProposalHeader"
import ProposalVotes from "./ProposalVotes"
import useProposalPage from "./hooks/useProposalPage"
import "./styles.scss"

// TODO: Get votes from proposal info
const MOCK_VOTES = [
	{address: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D", tokens: 100250},
	{address: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D", tokens: 100250},
	{address: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D", tokens: 50250},
	{address: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D", tokens: 50250},
	{address: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D", tokens: 49250},
	{address: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D", tokens: 39250}
]

// TODO: Decode proposal.multiTx, get list of transactions from there
const MOCK_TRANSACTION: {
	signature: string
	inputs: {name: string; value: string | null}[]
	to: string | null
	value: number
} = {
	signature: "_setContributorCompSpeed(address,uint256)",
	inputs: [
		{name: "address", value: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D"},
		{name: "uint256", value: "6496575342465753"}
	],
	to: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D",
	value: 0
}
const MOCK_TRANSACTIONS: Array<typeof MOCK_TRANSACTION> = [MOCK_TRANSACTION, MOCK_TRANSACTION]
const MOCK_VOTING_STRATEGY = "admin"

const Proposal: FunctionComponent = () => {
	const {account} = useContext(AuthContext)
	const {push} = useHistory()
	const {search} = useLocation()
	const id = useMemo(() => new URLSearchParams(search).get("id"), [search]) as string
	const {proposal, gnosisVotingThreshold, loading, error, canSign} = useProposal(id)
	const {sign, processing} = useSignProposal({proposal, gnosisVotingThreshold, canSign, id})
	const {
		tokensWrapped,
		voteDelegated,
		isAdminProposal,
		isExecuted,
		showWrapModal,
		showDelegateModal,
		wrapTokenSuccess,
		delegateTokenSuccess,
		handleCloseWrapModal,
		handleCloseDelegateModal,
		handleCloseWrapTokenSuccessModal,
		handleCloseDelegateTokenSuccessModal,
		handleWrapToken,
		handleDelegateToken,
		handleOpenWrapModal,
		handleOpenDelegateModal
	} = useProposalPage(proposal)

	if (loading || !proposal) return <Loader />
	if (error) return <ErrorPlaceholder />

	return (
		<>
			{!isAdminProposal && (
				<>
					<WrapTokenModal
						tokensHeld={100}
						mode={tokensWrapped ? "unwrap" : "wrap"}
						show={showWrapModal && !wrapTokenSuccess}
						onSubmit={handleWrapToken}
						onClose={handleCloseWrapModal}
					/>
					<DelegateTokenModal
						show={showDelegateModal && !delegateTokenSuccess}
						onClose={handleCloseDelegateModal}
						onSubmit={handleDelegateToken}
					/>
					<ConfirmationModal
						title="Success!"
						isOpened={showWrapModal && wrapTokenSuccess}
						text={
							tokensWrapped
								? "You have successfully wrapped your ERC-20 voting tokens. Proceed now to delegation. You may unwrap your wrapped tokens at any point, as long as they are both delegated to you and are not being used in an open proposal."
								: "You have successfully unwrapped your ERC-20 voting tokens. Please note that you must hold some wrapped ERC-20 voting tokens in order to participate in proposals utilizing voting strategies with this token. You may re-wrap your tokens at any point."
						}
						handleClose={handleCloseWrapTokenSuccessModal}
					/>
					<ConfirmationModal
						title="Success!"
						isOpened={showDelegateModal && !delegateTokenSuccess}
						text="You have successfully delegated your voting tokens. Your delegation choice will remain the same for all proposals utilizing voting strategies with this token, and you do not need to complete this step each time. If you wish to change your delegation choice, you may do so at any point, as long as the tokens are not being used in an open proposal."
						handleClose={handleCloseDelegateTokenSuccessModal}
					/>
				</>
			)}
			<div className="proposal">
				<ProposalHeader proposal={proposal} id={id} showLinks>
					<BackButton onClick={() => push(`/dao/${proposal.gnosisAddress}?page=proposals`)} />
				</ProposalHeader>
				<div className="proposal__content">
					{!isAdminProposal && (
						<div className="proposal__content-heading">
							<span>Quorum Status</span> <Tag variant="canceled">75%</Tag>
						</div>
					)}
					<div className="proposal__content-body">
						<div className="proposal__content-votes-cards">
							{isAdminProposal ? (
								<ProposalVotes
									fullWidth
									type="for"
									value={proposal.signatures.length}
									totalValue={gnosisVotingThreshold || proposal.signatures.length}
									votes={proposal.signatures.map(signature => ({
										address: signature.signer,
										tokens: 1
									}))}
									votingStrategy="admin"
								/>
							) : (
								<>
									<ProposalVotes
										type="for"
										value={500000}
										totalValue={1000000}
										votes={MOCK_VOTES}
										votingStrategy={MOCK_VOTING_STRATEGY}
									/>
									<ProposalVotes
										type="against"
										value={250000}
										totalValue={1000000}
										votes={MOCK_VOTES}
										votingStrategy={MOCK_VOTING_STRATEGY}
									/>
									<ProposalVotes
										type="abstain"
										value={250000}
										totalValue={1000000}
										votes={MOCK_VOTES}
										votingStrategy={MOCK_VOTING_STRATEGY}
									/>
								</>
							)}
						</div>
						<div className="proposal__content-details">
							<div className="proposal__content-details-left">
								<h2>Details</h2>
								{proposal.description && (
									<Expandable title="Description">{proposal.description}</Expandable>
								)}
								<Expandable title="Executable Code">
									{MOCK_TRANSACTIONS.map((transaction, idx) => (
										<Fragment key={idx}>
											<div className="proposal__transaction">
												<h3>Function {idx + 1}</h3>
												<div className="proposal__transaction-details">
													<p>Signature:</p>
													<span>{transaction.signature}</span>
													<p>Calldatas:</p>
													{transaction.inputs.map(input => (
														<p key={input.name} className="proposal__transaction-input">
															{input.name}: <span>{input.value}</span>
														</p>
													))}
													<p>Target:</p>
													<span>{transaction.to}</span>
													<p>Value:</p>
													<span>{transaction.value}</span>
												</div>
											</div>
											{idx + 1 !== MOCK_TRANSACTIONS.length && <Divider />}
										</Fragment>
									))}
								</Expandable>
							</div>
							<div className="proposal__content-details-right">
								<h2>Participate</h2>
								<Paper className="proposal__content-participate">
									{isExecuted ? (
										<p>This proposal has been confirmed and executed.</p>
									) : isAdminProposal ? (
										<>
											<Button
												disabled={!canSign || processing}
												onClick={sign}
												extraClassName="proposal__content-vote-button"
											>
												Confirm
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
										</>
									) : (
										<>
											<div>
												{tokensWrapped ? (
													<WrapTokenDone width="50px" height="50px" onClick={handleOpenWrapModal} />
												) : (
													<WrapTokenDefault
														width="50px"
														height="50px"
														onClick={handleOpenWrapModal}
													/>
												)}
											</div>
											<div className="proposal__content-participate-step">
												<h3>Step 1: Wrap Tokens</h3>
												{tokensWrapped ? (
													<>
														<p>Wrapped Token Address</p>
														<Copy value="TODO: Add real token address here">
															{formatReadableAddress(account)}
														</Copy>
														<Button buttonType="link" onClick={handleOpenWrapModal}>
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
											<Divider />
											<div>
												{voteDelegated ? (
													<DelegateTokenDone
														width="50px"
														height="50px"
														onClick={handleOpenDelegateModal}
													/>
												) : (
													<DelegateTokenDefault
														width="50px"
														height="50px"
														onClick={handleOpenDelegateModal}
														className={
															!tokensWrapped ? "proposal__content-participate-icon" : undefined
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
															{formatReadableAddress(account)}
														</Copy>
														<Button buttonType="link">Change Delegation</Button>
													</>
												) : (
													<p>Choose to delegate to yourself or another address.</p>
												)}
											</div>
											<Divider />
											<Button disabled={!tokensWrapped || !voteDelegated}>Vote</Button>
										</>
									)}
								</Paper>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default Proposal
