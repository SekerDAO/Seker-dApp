import React, {FunctionComponent} from "react"
import useDAOProposals from "../../../customHooks/getters/useDAOProposals"
import Loader from "../../Loader"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import {DAOProposalsTypeNames, Proposal} from "../../../types/proposal"
import "./styles.scss"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"

const DAOProposalCard: FunctionComponent<{proposal: Proposal}> = ({proposal}) => (
	<div className="dao-proposals__card">
		<div className="dao-proposals__card-header">
			<p>{DAOProposalsTypeNames[proposal.type]}</p>
			<p>TODO: state</p>
		</div>
		<div className="dao-proposals__card-footer">
			<h2>{proposal.title}</h2>
			<div className="dao-proposals__voting">
				<div className="dao-proposals__voting-legend">
					<p>TODO: yes</p>
					<p>TODO: no</p>
				</div>
				<div className="dao-proposals__voting-bar">
					<div
						className="dao-proposals__voting-bar-inner"
						style={{width: "75%"}} // TODO
					/>
				</div>
			</div>
		</div>
	</div>
)

const DAOProposals: FunctionComponent<{
	daoAddress: string
}> = ({daoAddress}) => {
	const {proposals, loading, error} = useDAOProposals(daoAddress)

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
