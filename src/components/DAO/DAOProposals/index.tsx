import {FunctionComponent} from "react"
import useProposals from "../../../hooks/getters/useProposals"
import Loader from "../../UI/Loader"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import {SafeProposalsTypeNames, SafeProposal} from "../../../types/safeProposal"
import "./styles.scss"
import SearchInput from "../../Controls/Input/SearchInput"
import Select from "../../Controls/Select"
import {capitalize} from "../../../utlls"
import {Link, useLocation} from "react-router-dom"

const DAOProposalCard: FunctionComponent<{
	proposal: SafeProposal & {proposalId: string}
}> = ({proposal}) => {
	const {pathname} = useLocation()

	return (
		<Link to={`${pathname}?page=proposal&id=${proposal.proposalId}`}>
			<div className="dao-proposals__card">
				<div className="dao-proposals__card-header">
					<p>{SafeProposalsTypeNames[proposal.type]}</p>
					<p>{capitalize(proposal.state)}</p>
				</div>
				<h2>{proposal.title}</h2>
				{proposal.type === "changeRole" && (
					<>
						<div className="dao-proposals__card-section">
							<b>Member&apos;s Address:</b>
							{` ${proposal.recipientAddress}`}
						</div>
						<div className="dao-proposals__card-section">
							<b>Proposed New Role:</b>
							{` ${capitalize(proposal.newRole!)}`}
						</div>
					</>
				)}
			</div>
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
