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
import SearchIcon from "../../../icons/SearchIcon"
import {
	startERC20HouseDAOFundingGracePeriod,
	startERC20HouseDAORoleChangeGracePeriod
} from "../../../api/ethers/functions/ERC20HouseDAO/startERC20HouseDAOProposalsGracePeriod"
import {executeERC20HouseDAORoleChange} from "../../../api/ethers/functions/ERC20HouseDAO/executeERC20HouseDAOProposals"

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

	const startGracePeriod = async () => {
		if (!(provider && signer)) return
		setProcessing(true)
		try {
			if (["changeRole", "joinHouse"].includes(proposal.type)) {
				await startERC20HouseDAORoleChangeGracePeriod(daoAddress, proposal.id!, provider, signer)
			} else if (proposal.type === "requestFunding") {
				await startERC20HouseDAOFundingGracePeriod(daoAddress, proposal.id!, provider, signer)
			}
			toastSuccess("Grace period started")
		} catch (e) {
			console.error(e)
			toastError("Failed to start grace period")
		}
		setProcessing(false)
	}

	const execute = async () => {
		if (!(provider && signer)) return
		setProcessing(true)
		try {
			if (["changeRole", "joinHouse"].includes(proposal.type)) {
				await executeERC20HouseDAORoleChange(daoAddress, proposal.id!, provider, signer)
			} else if (proposal.type === "requestFunding") {
				await startERC20HouseDAOFundingGracePeriod(daoAddress, proposal.id!, provider, signer)
			}
			toastSuccess("Grace period started")
		} catch (e) {
			console.error(e)
			toastError("Failed to start grace period")
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
						{proposal.state === "passed" && <Button onClick={startGracePeriod}>Queue</Button>}
						{proposal.state === "waiting" && <Button onClick={execute}>Execute</Button>}
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
				<div className="dao-proposals__search">
					<Input placeholder="Search" borders="bottom" />
					<SearchIcon />
				</div>
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
