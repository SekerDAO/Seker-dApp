import {Fragment, FunctionComponent, useContext, useMemo} from "react"
import {Link, useLocation, useHistory} from "react-router-dom"
import {ReactComponent as DelegateTokenDone} from "../../../assets/icons/delegate-token-done.svg"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"
import {ReactComponent as WrapTokenDone} from "../../../assets/icons/wrap-token-done.svg"
import {AuthContext} from "../../../context/AuthContext"
import useProposal from "../../../hooks/getters/useProposal"
import {capitalize, formatReadableAddress} from "../../../utlls"
import Button from "../../Controls/Button"
import BackButton from "../../Controls/Button/BackButton"
import useSignProposal from "../../Proposal/hooks/useSignProposal"
import Copy from "../../UI/Copy"
import Divider from "../../UI/Divider"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Expandable from "../../UI/Expandable"
import Loader from "../../UI/Loader"
import Paper from "../../UI/Paper"
import Tag from "../../UI/Tag"
import ProposalVotes from "./ProposalVotes"
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
const MOCK_ADMIN_VOTES = [
	{address: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D", tokens: 1},
	{address: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D", tokens: 1},
	{address: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D", tokens: 1},
	{address: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D", tokens: 1},
	{address: "0xF6690149C78D0254EF65FDAA6B23EC6A342f6d8D", tokens: 1}
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

	if (loading || !proposal) return <Loader />
	if (error) return <ErrorPlaceholder />

	const isExcecuted = proposal.state === "executed"
	const isExcecuting = proposal.state === "executing"
	// TODO: get actual voting strategy from proposal
	const isAdminProposal = MOCK_VOTING_STRATEGY === "admin"

	return (
		<div className="proposal">
			<div className="proposal__header">
				<BackButton onClick={() => push(`/dao/${proposal.gnosisAddress}?page=proposals`)} />
				<div className="proposal__header-title">
					<h1>{proposal.title}</h1>
					<span>{isAdminProposal ? "Admin Voting" : "Linear Voting"}</span>
				</div>
				<div className="proposal__header-subtitle">
					<Tag variant={proposal.state}>{capitalize(proposal.state)}</Tag>
					<span>ID [ {id} ]</span>
					{!isExcecuted && !isAdminProposal && (
						<>
							<span>•</span>
							<span>[ # ] Days, [ # ] Hours Left</span>
						</>
					)}
				</div>
				<div className="proposal__header-links">
					<p>
						Proposed by:
						<Link to={`/profile/${proposal.userAddress}`}>
							{formatReadableAddress(proposal.userAddress)}
						</Link>
					</p>
					{!isAdminProposal && (
						<p>
							Voting Token:
							<Link to={`TODO`}>{formatReadableAddress(proposal.userAddress)}</Link>
						</p>
					)}
				</div>
			</div>
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
								votingStrategy={"admin"}
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
								{isExcecuted ? (
									<p>This proposal has been confirmed and executed.</p>
								) : isAdminProposal ? (
									<>
										<Button
											disabled={!canSign || processing}
											onClick={
												isExcecuting
													? sign
													: () => console.log("TODO: Implement confirm(aka admin vote) action")
											}
											extraClassName="proposal__content-vote-button"
										>
											{isExcecuting ? "Execute" : "Confirm"}
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
											<WrapTokenDone width="50px" height="50px" />
										</div>
										<div className="proposal__content-participate-step">
											<h3>Step 1: Wrap Tokens</h3>
											<p>Wrapped Token Address</p>
											<Copy value="TODO: Add real token address here">
												{formatReadableAddress(account)}
											</Copy>
											<Button buttonType="link">Unwrap Tokens</Button>
										</div>
										<Divider />
										<div>
											<DelegateTokenDone width="50px" height="50px" />
										</div>
										<div className="proposal__content-participate-step">
											<h3>Step 2: Delegate</h3>
											<p>Currently Delegated to</p>
											<Copy value="TODO: Add delegated user address here">
												{formatReadableAddress(account)}
											</Copy>
											<Button buttonType="link">Change Delegation</Button>
										</div>
										<Divider />
										<Button>Vote</Button>
									</>
								)}
							</Paper>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Proposal
