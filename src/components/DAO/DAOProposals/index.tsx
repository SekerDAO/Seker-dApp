import React, {useContext, FunctionComponent} from "react"
import useDAOProposals from "../../../customHooks/getters/useDAOProposals"
import Loader from "../../Loader"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import EthersContext from "../../../context/EthersContext"
import {DAOProposalsTypeNames, Proposal} from "../../../types/proposal"
import "./styles.scss"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"
import {capitalize} from "../../../utlls"

const DAOProposalCard: FunctionComponent<{proposal: Proposal}> = ({proposal}) => (
	<div className="dao-proposals__card">
		<div className="dao-proposals__card-header">
			<p>{DAOProposalsTypeNames[proposal.type]}</p>
			<p>{capitalize(proposal.state)}</p>
		</div>
		<div className="dao-proposals__card-footer">
			<h2>{proposal.title}</h2>
			<div className="dao-proposals__voting">
				<div className="dao-proposals__voting-legend">
					<p>Yes</p>
					<p>No</p>
				</div>
				<div className="dao-proposals__voting-bar">
					<div
						className="dao-proposals__voting-bar-inner"
						style={{
							width: proposal.noVotes === 0 ? "100%" : `${Math.round((proposal.yesVotes * 100) / proposal.noVotes)}%`
						}}
					/>
				</div>
			</div>
		</div>
	</div>
)

const DAOProposals: FunctionComponent<{
	daoAddress: string
}> = ({daoAddress}) => {
	const {provider} = useContext(EthersContext)
	const {proposals, loading, error} = useDAOProposals(daoAddress)

	if (!provider) return <div>TODO: please connect wallet</div>
	if (error) return <ErrorPlaceholder />
	if (loading) return <Loader />

	return (
		<div className="dao-proposals">
			<h2>Proposals</h2>
			<div className="dao-proposals__controls">
				<Input borders="bottom" placeholder="Search" />
				<Select options={[{name: "Filter By", value: ""}]} />
				<Select options={[{name: "Sort By", value: ""}]} />
			</div>
			{proposals.map((proposal, index) => (
				<DAOProposalCard proposal={proposal} key={index} />
			))}
		</div>
	)
}

export default DAOProposals
