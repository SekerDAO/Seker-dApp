import {Fragment, FunctionComponent, useContext} from "react"
import {Link, useParams, useHistory} from "react-router-dom"
import DAODashboard from "../../components/DAO/DAODashboard"
import {AuthContext} from "../../context/AuthContext"
import "./styles.scss"
import useProposal from "../../hooks/getters/useProposal"
import Loader from "../../components/UI/Loader"
import ErrorPlaceholder from "../../components/UI/ErrorPlaceholder"
import Tag from "../../components/UI/Tag"
import {capitalize, formatReadableAddress} from "../../utlls"
import useDAO from "../../hooks/getters/useDAO"
import BackButton from "../../components/Controls/Button/BackButton"
import VotesCard from "../../components/Proposal/VotesCard"
import Expandable from "../../components/UI/Expandable"
import Divider from "../../components/UI/Divider"
import Paper from "../../components/UI/Paper"
import CopyField from "../../components/UI/Copy"
import Button from "../../components/Controls/Button"
import {ReactComponent as WrapTokenDone} from "../../assets/icons/wrap-token-done.svg"
import {ReactComponent as DelegateTokenDone} from "../../assets/icons/delegate-token-done.svg"
import useSignProposal from "../../components/Proposal/hooks/useSignProposal"

const Proposal: FunctionComponent = () => {
	const {id} = useParams<{id: string}>()
	const {account, connected} = useContext(AuthContext)
	const {proposal, gnosisVotingThreshold, loading, error, canSign} = useProposal(id)
	const {sign, processing} = useSignProposal({id, proposal, gnosisVotingThreshold, canSign})
	const {dao} = useDAO(proposal?.gnosisAddress)
	const {push} = useHistory()

	// TODO: Get votes from proposal info
	const MOCK_VOTES = [
		{address: account ?? "", tokens: 100250},
		{address: account ?? "", tokens: 100250},
		{address: account ?? "", tokens: 50250},
		{address: account ?? "", tokens: 50250},
		{address: account ?? "", tokens: 49250},
		{address: account ?? "", tokens: 39250}
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
			{name: "address", value: account},
			{name: "uint256", value: "6496575342465753"}
		],
		to: account,
		value: 0
	}
	const MOCK_TRANSACTIONS: Array<typeof MOCK_TRANSACTION> = [MOCK_TRANSACTION, MOCK_TRANSACTION]

	if (loading || !proposal || !dao) return <Loader />
	if (error) return <ErrorPlaceholder />

	const isAdmin = connected && !!dao.owners.find(addr => addr === account)
	const isExecuted = proposal.state === "executed"

	return (
		<DAODashboard page="proposals" loading={loading} error={error} isAdmin={isAdmin} dao={dao}>
			<div className="proposal">
				<div className="proposal__header">
					<BackButton onClick={() => push(`/dao/${proposal.gnosisAddress}?page=proposals`)} />
					<div className="proposal__header-title">
						<h1>{proposal.title}</h1>
						<span>Linear Voting</span>
					</div>
					<div className="proposal__header-subtitle">
						<Tag variant={proposal.state}>{capitalize(proposal.state)}</Tag>
						<span>ID [ {id} ]</span>
						{!isExecuted && (
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
						<p>
							Voting Token:
							<Link to={`TODO`}>{formatReadableAddress(proposal.userAddress)}</Link>
						</p>
					</div>
				</div>
				<div className="proposal__content">
					<div className="proposal__content-heading">
						<span>Quorum Status</span> <Tag variant="canceled">75%</Tag>
					</div>
					<div className="proposal__content-body">
						<div className="proposal__content-votes-cards">
							<VotesCard type="for" tokensValue={500000} percentageValue={50} votes={MOCK_VOTES} />
							<VotesCard
								type="against"
								tokensValue={250000}
								percentageValue={25}
								votes={MOCK_VOTES}
							/>
							<VotesCard
								type="abstain"
								tokensValue={250000}
								percentageValue={25}
								votes={MOCK_VOTES}
							/>
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
										<p>This proposal has been passed and executed.</p>
									) : (
										<>
											<div>
												<WrapTokenDone width="50px" height="50px" />
											</div>
											<div className="proposal__content-participate-step">
												<h3>Step 1: Wrap Tokens</h3>
												<p>Wrapped Token Address</p>
												<CopyField value="TODO: Add real token address here">
													{formatReadableAddress(account)}
												</CopyField>
												<Button buttonType="link">Unwrap Tokens</Button>
											</div>
											<Divider />
											<div>
												<DelegateTokenDone width="50px" height="50px" />
											</div>
											<div className="proposal__content-participate-step">
												<h3>Step 2: Delegate</h3>
												<p>Currently Delegated to</p>
												<CopyField value="TODO: Add delegated user address here">
													{formatReadableAddress(account)}
												</CopyField>
												<Button buttonType="link">Change Delegation</Button>
											</div>
											<Divider />
											<Button
												disabled={!canSign && !processing}
												onClick={sign}
												extraClassName="proposal__content-vote-button"
											>
												Vote
											</Button>
										</>
									)}
								</Paper>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DAODashboard>
	)
}

export default Proposal
