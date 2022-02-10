import {FunctionComponent, useState} from "react"
import {Link, useLocation} from "react-router-dom"
import useProposals from "../../../hooks/getters/useProposals"
import {isSafeProposal, SafeProposal, SafeProposalState} from "../../../types/safeProposal"
import {StrategyProposal, StrategyProposalState} from "../../../types/strategyProposal"
import Select from "../../Controls/Select"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Loader"
import Paper from "../../UI/Paper"
import ProposalHeader from "../Proposal/ProposalHeader"
import "./styles.scss"

const DAOProposalCard: FunctionComponent<{
	proposal: (SafeProposal | StrategyProposal) & {proposalId: string; multiChain?: boolean}
}> = ({proposal}) => {
	const {pathname} = useLocation()

	return (
		<Link
			to={`${pathname}?page=proposal&type=${isSafeProposal(proposal) ? "safe" : "strategy"}&id=${
				proposal.proposalId
			}`}
		>
			<Paper className="dao-proposals__card">
				<ProposalHeader
					proposal={proposal}
					id={proposal.proposalId}
					sideChain={!!proposal.multiChain}
				/>
			</Paper>
		</Link>
	)
}

const DAOProposals: FunctionComponent<{
	gnosisAddress: string
}> = ({gnosisAddress}) => {
	const {proposals, loading, error} = useProposals(gnosisAddress)
	const [filterStatus, setFilterStatus] = useState<
		SafeProposalState | StrategyProposalState | "all"
	>("all")

	const handleFilterChange = (newValue: SafeProposalState | StrategyProposalState | "all") => {
		setFilterStatus(newValue)
	}

	if (error) return <ErrorPlaceholder />
	if (loading) return <Loader />

	return (
		<div className="dao-proposals">
			<div className="dao-proposals__header">
				<h1>Proposals</h1>
				<Select
					placeholder="Choose One"
					options={[
						{name: "View All", value: "all"},
						{name: "Active", value: "active"},
						{name: "Executed", value: "executed"},
						{name: "Queued", value: "outdated"},
						{name: "Canceled", value: "canceled"},
						{name: "Time Locked", value: "timeLocked"},
						{name: "Executing", value: "executing"},
						{name: "Pending", value: "pending"},
						{name: "Failed", value: "failed"},
						{name: "Uninitialized", value: "uninitialized"}
					]}
					value={filterStatus}
					onChange={handleFilterChange}
				/>
			</div>
			{proposals
				.filter(proposal => (filterStatus === "all" ? true : proposal.state === filterStatus))
				.map((proposal, index) => (
					<DAOProposalCard proposal={proposal} key={index} />
				))}
		</div>
	)
}

export default DAOProposals
