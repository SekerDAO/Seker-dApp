import React, {useContext, FunctionComponent, useState} from "react"
import useERC20DAOProposals from "../../../customHooks/getters/useERC20DAOProposals"
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
import addProposalSignature from "../../../api/firebase/proposal/addProposalSignature"
import {SafeSignature} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import {
	executeApproveNFTForZoraAuction,
	signApproveNFTForZoraAuction
} from "../../../api/ethers/functions/zoraAuction/approveNFTForZoraAuction"
import {
	executeCreateZoraAuction,
	signCreateZoraAuction
} from "../../../api/ethers/functions/zoraAuction/createZoraAuction"
import {
	executeApproveZoraAuction,
	signApproveZoraAuction
} from "../../../api/ethers/functions/zoraAuction/approveZoraAuction"
import {
	executeCancelZoraAuction,
	signCancelZoraAuction
} from "../../../api/ethers/functions/zoraAuction/cancelZoraAuction"
import {
	executeAddOwner,
	signAddOwner
} from "../../../api/ethers/functions/gnosisSafe/addRemoveOwner"
import {AuthContext} from "../../../context/AuthContext"
const {REACT_APP_CLOUD_FUNCTIONS_URL} = process.env

const DAOProposalCard: FunctionComponent<{
	gnosisVotingThreshold: number
	proposal: Proposal & {proposalId: string}
	isMember: boolean
	isAdmin: boolean
	daoAddress?: string
}> = ({gnosisVotingThreshold, proposal, isMember, daoAddress, isAdmin}) => {
	const [processing, setProcessing] = useState(false)
	const {provider, signer} = useContext(EthersContext)
	const {account} = useContext(AuthContext)

	const handleVote = async (yes: boolean) => {
		if (!(provider && signer && daoAddress)) return
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
		if (!(provider && signer && daoAddress)) return
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
		if (!(provider && signer && daoAddress)) return
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

	const sign = async () => {
		if (!(signer && isAdmin)) return
		setProcessing(true)
		try {
			let signature: SafeSignature | undefined = undefined
			let signatureStep2: SafeSignature | undefined = undefined
			let executed = false
			switch (proposal.type) {
				case "createZoraAuction":
					const signingArgs = [
						proposal.gnosisAddress,
						Number(proposal.nftId),
						proposal.nftAddress!,
						proposal.duration!,
						proposal.reservePrice!,
						proposal.curatorAddress!,
						proposal.curatorFeePercentage!,
						proposal.auctionCurrencyAddress!,
						signer
					] as const
					signature = await signApproveNFTForZoraAuction(...signingArgs)
					signatureStep2 = await signCreateZoraAuction(...signingArgs)
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
						await executeApproveNFTForZoraAuction(
							proposal.gnosisAddress,
							proposal.nftId!,
							proposal.nftAddress!,
							[...proposal.signatures, signature],
							signer
						)
						await executeCreateZoraAuction(
							proposal.gnosisAddress,
							Number(proposal.nftId),
							proposal.nftAddress!,
							proposal.duration!,
							proposal.reservePrice!,
							proposal.curatorAddress!,
							proposal.curatorFeePercentage!,
							proposal.auctionCurrencyAddress!,
							[...proposal.signaturesStep2!, signatureStep2],
							signer
						)
						executed = true
					}
					break
				case "approveZoraAuction":
					signature = await signApproveZoraAuction(
						proposal.gnosisAddress,
						proposal.auctionId!,
						signer
					)
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
						await executeApproveZoraAuction(
							proposal.gnosisAddress,
							proposal.auctionId!,
							[...proposal.signatures, signature],
							signer
						)
						executed = true
					}
					break
				case "cancelZoraAuction":
					signature = await signCancelZoraAuction(
						proposal.gnosisAddress,
						proposal.auctionId!,
						signer
					)
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
						await executeCancelZoraAuction(
							proposal.gnosisAddress,
							proposal.auctionId!,
							[...proposal.signatures, signature],
							signer
						)
						executed = true
					}
					break
				case "changeRole":
					if (["head", "admin"].includes(proposal.newRole!)) {
						signature = await signAddOwner(
							proposal.gnosisAddress,
							proposal.recipientAddress!,
							proposal.newThreshold!,
							signer
						)
						if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
							await executeAddOwner(
								proposal.gnosisAddress,
								proposal.recipientAddress!,
								proposal.newThreshold!,
								[...proposal.signatures, signature],
								signer
							)
							executed = true
							// TODO: call BE function to update owners
						}
					} else {
						console.log("Handling kick not implemented")
					}
					break
				default:
					console.log("Unexpected proposal type to sign")
			}
			await addProposalSignature({
				proposalId: proposal.proposalId,
				signature: signature!,
				signatureStep2,
				...(executed ? {newState: "executed"} : {})
			})
			toastSuccess("Successfully signed!")
		} catch (e) {
			console.error(e)
			toastError("Failed to sign proposal")
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
			<div className="dao-proposals__card-footer">
				{proposal.module === "DAO" && (
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
				)}
				<div className="dao-proposals__voting-buttons">
					{isMember &&
						proposal.state === "active" &&
						proposal.module === "DAO" &&
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
					{isAdmin &&
						proposal.state === "active" &&
						!proposal.signatures?.find(s => s.signer.toLowerCase() === account) && (
							<Button onClick={sign} disabled={processing}>
								{processing ? "Processing..." : "Sign"}
							</Button>
						)}
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
		</div>
	)
}

const DAOProposals: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	daoAddress?: string
	isMember: boolean
	isAdmin: boolean
}> = ({gnosisVotingThreshold, gnosisAddress, daoAddress, isMember, isAdmin}) => {
	const {provider} = useContext(EthersContext)
	const {proposals, loading, error} = useERC20DAOProposals(gnosisAddress)

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
					gnosisVotingThreshold={gnosisVotingThreshold}
					daoAddress={daoAddress}
					proposal={proposal}
					key={index}
					isMember={isMember}
					isAdmin={isAdmin}
				/>
			))}
		</div>
	)
}

export default DAOProposals
