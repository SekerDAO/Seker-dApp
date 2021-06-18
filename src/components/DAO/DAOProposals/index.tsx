import React, {useContext, FunctionComponent, useState} from "react"
import useERC20HouseDAOProposals from "../../../customHooks/getters/useERC20HouseDAOProposals"
import Loader from "../../Loader"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import EthersContext from "../../../context/EthersContext"
import {DAOProposalsTypeNames, Proposal} from "../../../types/proposal"
import "./styles.scss"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"
import {capitalize} from "../../../utlls"
import Button from "../../Controls/Button"
import {toastError, toastSuccess} from "../../Toast"
import voteForERC20HouseDAOProposal from "../../../api/ethers/functions/ERC20HouseDAO/voteForERC20HouseDAOProposal"

const DAOProposalCard: FunctionComponent<{
	proposal: Proposal
	isMember: boolean
	daoAddress: string
}> = ({proposal, isMember, daoAddress}) => {
	const [processing, setProcessing] = useState(false)
	const {provider, signer} = useContext(EthersContext)

	const handleVote = async (yes: boolean) => {
		if (!(provider && signer)) return
		setProcessing(true)
		try {
			await voteForERC20HouseDAOProposal(daoAddress, proposal.id!, yes, provider, signer)
			toastSuccess("Vote successful!")
		} catch (e) {
			console.error(e)
			toastError("Failed to vote")
		}
		setProcessing(false)
	}

	return (
		<div className="dao-proposals__card">
			<div className="dao-proposals__card-header">
				<p>{DAOProposalsTypeNames[proposal.type]}</p>
				<p>{capitalize(proposal.state)}</p>
			</div>
			<h2>{proposal.title}</h2>
			<p>{proposal.description}</p>
			{proposal.type === "joinHouse" && (
				<div className="dao-proposals__card-section">
					<b>Amount of governance token currently owned:</b>
					{` ${proposal.balance}`}
				</div>
			)}
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
			{["applyForCommission", "requestFunding"].includes(proposal.type) && (
				<>
					<div className="dao-proposals__card-section">
						<b>Requested amount:</b>
						{` ${proposal.amount} ETH`}
					</div>
					<div className="dao-proposals__card-section">
						<b>Recipient:</b>
						{` ${proposal.recipientAddress}`}
					</div>
				</>
			)}
			{proposal.type !== "applyForCommission" && (
				<div className="dao-proposals__card-footer">
					<div className="dao-proposals__voting">
						<div className="dao-proposals__voting-legend">
							<p>Yes</p>
							<p>No</p>
						</div>
						<div className="dao-proposals__voting-bar">
							<div
								className="dao-proposals__voting-bar-inner"
								style={{
									width:
										proposal.noVotes === 0 ? "100%" : `${Math.round((proposal.yesVotes * 100) / proposal.noVotes)}%`
								}}
							/>
						</div>
					</div>
					<div className="dao-proposals__voting-buttons">
						{isMember &&
							proposal.state === "active" &&
							(processing ? (
								"Voting..."
							) : (
								<>
									<Button
										disabled={processing}
										buttonType="primary"
										onClick={() => {
											handleVote(true)
										}}
									>
										Yes
									</Button>
									<Button
										disabled={processing}
										buttonType="secondary"
										onClick={() => {
											handleVote(false)
										}}
									>
										No
									</Button>
								</>
							))}
					</div>
				</div>
			)}
		</div>
	)
}

const DAOProposals: FunctionComponent<{
	daoAddress: string
	isMember: boolean
}> = ({daoAddress, isMember}) => {
	const {provider} = useContext(EthersContext)
	const {proposals, loading, error} = useERC20HouseDAOProposals(daoAddress)

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
				<DAOProposalCard daoAddress={daoAddress} proposal={proposal} key={index} isMember={isMember} />
			))}
		</div>
	)
}

export default DAOProposals
