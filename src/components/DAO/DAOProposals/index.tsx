import {FunctionComponent, useState} from "react"
import {Link, useLocation} from "react-router-dom"
import useProposals from "../../../hooks/getters/useProposals"
import {SafeProposal} from "../../../types/safeProposal"
import {StrategyProposal} from "../../../types/strategyProposal"
import Select from "../../Controls/Select"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Loader"
import Paper from "../../UI/Paper"
import ProposalHeader from "../Proposal/ProposalHeader"
import "./styles.scss"

const DAOProposalCard: FunctionComponent<{
	proposal: (SafeProposal | StrategyProposal) & {proposalId: string}
}> = ({proposal}) => {
	const {pathname} = useLocation()

	return (
		<Link
			to={`${pathname}?page=proposal&type=${
				(proposal as SafeProposal).type ? "safe" : "strategy"
			}&id=${proposal.proposalId}`}
		>
			<Paper className="dao-proposals__card">
				<ProposalHeader proposal={proposal} id={proposal.proposalId} />
			</Paper>
		</Link>
	)
}

const DAOProposals: FunctionComponent<{
	gnosisAddress: string
}> = ({gnosisAddress}) => {
	const {proposals, loading, error} = useProposals(gnosisAddress)
	const [filterStatus, setFilterStatus] = useState("all")

	const handleFilterChange = (newValue: string) => {
		setFilterStatus(newValue)
		console.log("TODO: Implement filtering")
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
						{name: "Pending", value: "pending"},
						{name: "Queued", value: "queued"},
						{name: "Executing", value: "executing"},
						{name: "Executed", value: "executed"},
						{name: "Failed", value: "failed"},
						{name: "Canceled", value: "canceled"}
					]}
					value={filterStatus}
					onChange={handleFilterChange}
				/>
			</div>
			{proposals.map((proposal, index) => (
				<DAOProposalCard proposal={proposal} key={index} />
			))}
		</div>
	)
}

export default DAOProposals
