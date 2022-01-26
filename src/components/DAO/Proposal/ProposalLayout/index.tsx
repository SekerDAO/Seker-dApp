import {Fragment, FunctionComponent} from "react"
import {useHistory} from "react-router-dom"
import {isSafeProposal, SafeProposal} from "../../../../types/safeProposal"
import {StrategyProposal, StrategyProposalVote} from "../../../../types/strategyProposal"
import BackButton from "../../../Controls/Button/BackButton"
import Divider from "../../../UI/Divider"
import Expandable from "../../../UI/Expandable"
import Loader from "../../../UI/Loader"
import Paper from "../../../UI/Paper"
import Tag from "../../../UI/Tag"
import ProposalHeader from "../ProposalHeader"
import AdminProposalVotes from "../ProposalVotes/AdminProposalVotes"
import StrategyProposalVotes from "../ProposalVotes/StrategyProposalVotes"

const ProposalLayout: FunctionComponent<{
	proposal: (SafeProposal | StrategyProposal) & {proposalId: string; multiChain?: boolean}
	votesThreshold: number
	votes?: StrategyProposalVote[]
	votesLoading?: boolean
}> = ({proposal, votesLoading, votesThreshold, children, votes}) => {
	const {push} = useHistory()

	const isAdminProposal = isSafeProposal(proposal)

	return (
		<div className="proposal">
			<ProposalHeader
				proposal={proposal}
				id={proposal.proposalId}
				showLinks
				sideChain={!!proposal.multiChain}
			>
				<BackButton onClick={() => push(`/dao/${proposal.gnosisAddress}?page=proposals`)} />
			</ProposalHeader>
			<div className="proposal__content">
				{!isAdminProposal && (
					<div className="proposal__content-heading">
						<span>Quorum Status</span>{" "}
						<Tag variant="canceled">
							{proposal.votes.quorum.isZero()
								? 0
								: Math.min(
										100,
										Math.round(
											proposal.votes.yes
												.add(proposal.votes.abstain)
												.div(proposal.votes.quorum)
												.toNumber() * 100
										)
								  )}
							%
						</Tag>
					</div>
				)}
				<div className="proposal__content-body">
					<div className="proposal__content-votes-cards">
						{isAdminProposal ? (
							<AdminProposalVotes
								fullWidth
								value={proposal.signatures.length}
								totalValue={votesThreshold}
								votes={proposal.signatures.map(signature => ({
									address: signature.signer,
									tokens: 1
								}))}
							/>
						) : votesLoading ? (
							<Loader />
						) : (
							<>
								<StrategyProposalVotes
									type="for"
									value={proposal.votes.yes}
									totalValue={proposal.votes.yes.add(proposal.votes.no).add(proposal.votes.abstain)}
									votes={votes!.filter(v => v.choice === "yes")}
									sideChain={!!proposal.multiChain}
								/>
								<StrategyProposalVotes
									type="against"
									value={proposal.votes.no}
									totalValue={proposal.votes.yes.add(proposal.votes.no).add(proposal.votes.abstain)}
									votes={votes!.filter(v => v.choice === "no")}
									sideChain={!!proposal.multiChain}
								/>
								<StrategyProposalVotes
									type="abstain"
									value={proposal.votes.abstain}
									totalValue={proposal.votes.yes.add(proposal.votes.no).add(proposal.votes.abstain)}
									votes={votes!.filter(v => v.choice === "abstain")}
									sideChain={!!proposal.multiChain}
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
								{proposal.transactions?.map((transaction, idx) => {
									const contractMethod =
										transaction.contractMethods[transaction.selectedMethodIndex]
									return (
										<Fragment key={idx}>
											<div className="proposal__transaction">
												<h3>Function {idx + 1}</h3>
												<div className="proposal__transaction-details">
													<p>Signature:</p>
													<span>
														{contractMethod.name}(
														{contractMethod.inputs.map(
															(input, index) =>
																`${input.type}${
																	index === contractMethod.inputs.length - 1 ? "" : ", "
																}`
														)}
														)
													</span>
													<p>Calldatas:</p>
													{contractMethod.inputs.map((input, index) => (
														<p key={input.name} className="proposal__transaction-input">
															{input.name}: <span>{transaction.args[index]}</span>
														</p>
													))}
													<p>Target:</p>
													<span>{transaction.address}</span>
													<p>Value:</p>
													<span>{transaction?.value || "0"}</span>
												</div>
											</div>
											{idx !== proposal.transactions!.length - 1 && <Divider />}
										</Fragment>
									)
								})}
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
