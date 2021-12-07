import {Fragment, FunctionComponent} from "react"
import {useHistory} from "react-router-dom"
import {VotingStrategyName} from "../../../../types/DAO"
import {isSafeProposal, SafeProposal} from "../../../../types/safeProposal"
import {StrategyProposal} from "../../../../types/strategyProposal"
import BackButton from "../../../Controls/Button/BackButton"
import Divider from "../../../UI/Divider"
import Expandable from "../../../UI/Expandable"
import Paper from "../../../UI/Paper"
import Tag from "../../../UI/Tag"
import ProposalHeader from "../ProposalHeader"
import ProposalVotes from "../ProposalVotes"

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

const ProposalLayout: FunctionComponent<{
	proposal: (SafeProposal | StrategyProposal) & {proposalId: string}
	votesThreshold: number
	votingStrategy: "admin" | VotingStrategyName
}> = ({proposal, votesThreshold, votingStrategy, children}) => {
	const {push} = useHistory()

	const isAdminProposal = isSafeProposal(proposal)

	return (
		<div className="proposal">
			<ProposalHeader proposal={proposal} id={proposal.proposalId} showLinks>
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
								totalValue={votesThreshold}
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
									votingStrategy={votingStrategy}
								/>
								<ProposalVotes
									type="against"
									value={250000}
									totalValue={1000000}
									votes={MOCK_VOTES}
									votingStrategy={votingStrategy}
								/>
								<ProposalVotes
									type="abstain"
									value={250000}
									totalValue={1000000}
									votes={MOCK_VOTES}
									votingStrategy={votingStrategy}
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
							<Paper className="proposal__content-participate">{children}</Paper>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ProposalLayout
