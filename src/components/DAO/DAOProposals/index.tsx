import React, {useContext, useState, useEffect, FunctionComponent} from "react"
import useDAOProposals from "../../../customHooks/getters/useDAOProposals"
import Loader from "../../Loader"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import EthersContext from "../../../context/EthersContext"
import {DAOProposalsTypeNames, Proposal} from "../../../types/proposal"
import {
	getHouseERC20ProposalDeadline,
	getHouseERC20ProposalCanceled,
	getHouseERC20ProposalExecuted
} from "../../../api/ethers/functions/getDAOState"
import "./styles.scss"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"

const DAOProposalCard: FunctionComponent<{proposal: Proposal; daoAddress: string}> = ({proposal, daoAddress}) => {
	const [proposalState, setProposalState] = useState("")
	const {provider, signer} = useContext(EthersContext)
	const getState = async () => {
		if (!provider) return
		const date = await getHouseERC20ProposalDeadline(daoAddress, proposal.id, provider)
		const executed = await getHouseERC20ProposalExecuted(daoAddress, proposal.id, provider)
		const canceled = await getHouseERC20ProposalCanceled(daoAddress, proposal.id, provider)
		const seconds = new Date().getTime() / 1000
		if (canceled) {
			setProposalState("Canceled")
		} else if (executed) {
			setProposalState("Executed")
		} else if (date < seconds) {
			setProposalState("Expired")
		} else {
			setProposalState(date.toString())
		} // TODO Check for in funding proposal grace period
		// TODO check if passed before executed
	}
	useEffect(() => {
		getState()
	}, [])
	return (
		<div className="dao-proposals__card">
			<div className="dao-proposals__card-header">
				<p>{DAOProposalsTypeNames[proposal.type]}</p>
				<p>{proposalState}</p>
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
}

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
				<DAOProposalCard daoAddress={daoAddress} proposal={proposal} key={index} />
			))}
		</div>
	)
}

export default DAOProposals
