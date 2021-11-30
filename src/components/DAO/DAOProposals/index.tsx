import {FunctionComponent} from "react"
import {Link, useLocation} from "react-router-dom"
import useProposals from "../../../hooks/getters/useProposals"
import {SafeProposal} from "../../../types/safeProposal"
import SearchInput from "../../Controls/Input/SearchInput"
import Select from "../../Controls/Select"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Loader"
import Paper from "../../UI/Paper"
import ProposalHeader from "../Proposal/ProposalHeader"
import "./styles.scss"

const DAOProposalCard: FunctionComponent<{
	proposal: SafeProposal & {proposalId: string}
}> = ({proposal}) => {
	const {pathname} = useLocation()

	return (
		<Link to={`${pathname}?page=proposal&id=${proposal.proposalId}`}>
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

	const handleFilterChange = () => {
		console.log("TODO: Implement filtering")
	}
	const handleSortChange = () => {
		console.log("TODO: Implement sorting")
	}

	if (error) return <ErrorPlaceholder />
	if (loading) return <Loader />

	return (
		<div className="dao-proposals">
			<h2>Proposals</h2>
			<div className="dao-proposals__controls">
				<SearchInput />
				<Select options={[]} placeholder="Filter By" value="" onChange={handleFilterChange} />
				<Select options={[]} placeholder="Sort By" value="" onChange={handleSortChange} />
			</div>
			{proposals.map((proposal, index) => (
				<DAOProposalCard proposal={proposal} key={index} />
			))}
		</div>
	)
}

export default DAOProposals
