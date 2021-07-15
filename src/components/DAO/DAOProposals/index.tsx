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
import voteForERC20DAOProposal from "../../../api/ethers/functions/ERC20DAO/voteForERC20DAOProposal"
import SearchIcon from "../../../icons/SearchIcon"
import {
	startERC20DAOFundingGracePeriod,
	startERC20DAORoleChangeGracePeriod
} from "../../../api/ethers/functions/ERC20DAO/startERC20DAOProposalsGracePeriod"
import {
	executeERC20DAOFundingProposal,
	executeERC20DAOJoin,
	executeERC20DAORoleChange
} from "../../../api/ethers/functions/ERC20DAO/executeERC20DAOProposals"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

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
			await voteForERC20DAOProposal(daoAddress, proposal.id!, yes, provider, signer)
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
				await startERC20DAORoleChangeGracePeriod(daoAddress, proposal.id!, provider, signer)
			} else if (proposal.type === "requestFunding") {
				await startERC20DAOFundingGracePeriod(daoAddress, proposal.id!, provider, signer)
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
			if (proposal.type === "changeRole") {
				await executeERC20DAORoleChange(daoAddress, proposal.id!, provider, signer)

				const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/updateDaoUser`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						daoAddress,
						memberAddress: proposal.recipientAddress
					})
				})
				if (res.status !== 200) {
					throw new Error("Failed to add member")
				}
			} else if (proposal.type === "joinHouse") {
				await executeERC20DAOJoin(daoAddress, proposal.id!, provider, signer)

				const res = await fetch(`${REACT_APP_CLOUD_FUNCTIONS_URL}/updateDaoUser`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						daoAddress,
						memberAddress: proposal.userAddress
					})
				})
				if (res.status !== 200) {
					throw new Error("Failed to add member")
				}
			} else if (proposal.type === "requestFunding") {
				await executeERC20DAOFundingProposal(daoAddress, proposal.id!, provider, signer)
			}
			toastSuccess("Proposal successfully executed")
		} catch (e) {
			console.error(e)
			toastError("Failed to execute proposal")
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
										proposal.noVotes === 0
											? "100%"
											: `${Math.round((proposal.yesVotes * 100) / proposal.noVotes)}%`
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
						{proposal.state === "passed" && (
							<Button onClick={startGracePeriod} disabled={processing}>
								{processing ? "Processing..." : "Queue"}
							</Button>
						)}
						{proposal.state === "waiting" && (
							<Button onClick={execute} disabled={processing}>
								{processing ? "Processing..." : "Execute"}
							</Button>
						)}
					</div>
				</div>
			)}
		</div>
	)
}

const DAOProposals: FunctionComponent<{
	gnosisAddress: string
	daoAddress: string
	isMember: boolean
}> = ({gnosisAddress, daoAddress, isMember}) => {
	const {provider} = useContext(EthersContext)
	const {proposals, loading, error} = useERC20HouseDAOProposals(gnosisAddress)

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
				<DAOProposalCard
					daoAddress={daoAddress}
					proposal={proposal}
					key={index}
					isMember={isMember}
				/>
			))}
		</div>
	)
}

export default DAOProposals
