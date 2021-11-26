import {Fragment, FunctionComponent, useContext, useState} from "react"
import {Link, useParams, useHistory} from "react-router-dom"
import DAODashboard from "../../components/DAO/DAODashboard"
import EthersContext from "../../context/EthersContext"
import {AuthContext} from "../../context/AuthContext"
import {SafeSignature} from "../../api/ethers/functions/gnosisSafe/safeUtils"
import {
	executeApproveNFTForAuction,
	signApproveNFTForAuction
} from "../../api/ethers/functions/auction/approveNFTForAuction"
import {
	executeCreateAuction,
	signCreateAuction
} from "../../api/ethers/functions/auction/createAuction"
import {
	executeCancelAuction,
	signCancelAuction
} from "../../api/ethers/functions/auction/cancelAuction"
import {
	executeAddOwner,
	executeRemoveOwner,
	signAddOwner,
	signRemoveOwner
} from "../../api/ethers/functions/gnosisSafe/addRemoveOwner"
import addSafeProposalSignature from "../../api/firebase/safeProposal/addSafeProposalSignatures"
import {toastError, toastSuccess} from "../../components/UI/Toast"
import "./styles.scss"
import useProposal from "../../hooks/getters/useProposal"
import Loader from "../../components/UI/Loader"
import ErrorPlaceholder from "../../components/UI/ErrorPlaceholder"
import {executeMultiSend, signMultiSend} from "../../api/ethers/functions/Usul/multiSend"
import editDAO from "../../api/firebase/DAO/editDAO"
import Tag from "../../components/UI/Tag"
import {capitalize, formatReadableAddress} from "../../utlls"
import useDAO from "../../hooks/getters/useDAO"
import BackButton from "../../components/Controls/Button/BackButton"
import VotesCard from "../../components/Proposal/VotesCard"
import Expandable from "../../components/UI/Expandable"
import Divider from "../../components/UI/Divider"

const Proposal: FunctionComponent = () => {
	const {id} = useParams<{id: string}>()
	const {account, connected} = useContext(AuthContext)
	const {proposal, gnosisVotingThreshold, loading, error, canSign} = useProposal(id)
	const {dao} = useDAO(proposal?.gnosisAddress)
	const [processing, setProcessing] = useState(false)
	const {signer} = useContext(EthersContext)
	const {push} = useHistory()

	// TODO: Get votes from proposal info
	const MOCK_VOTES = [
		{address: account ?? "", tokens: 100250},
		{address: account ?? "", tokens: 100250},
		{address: account ?? "", tokens: 50250},
		{address: account ?? "", tokens: 50250},
		{address: account ?? "", tokens: 49250},
		{address: account ?? "", tokens: 39250}
	]

	// TODO: Decode proposal.multiTx, get list of transactions from there
	const MOCK_TRANSACTION: {
		signature: string
		inputs: {name: string; value: string | null}[]
		to: string | null
		value: number
	} = {
		signature: "_setContributorCompSpeed(address,uint256)",
		inputs: [
			{name: "address", value: account},
			{name: "uint256", value: "6496575342465753"}
		],
		to: account,
		value: 0
	}
	const MOCK_TRANSACTIONS: Array<typeof MOCK_TRANSACTION> = [MOCK_TRANSACTION, MOCK_TRANSACTION]

	if (loading || !proposal || !dao) return <Loader />
	if (error) return <ErrorPlaceholder />

	const isAdmin = connected && !!dao.owners.find(addr => addr === account)

	const sign = async () => {
		if (!(signer && proposal && gnosisVotingThreshold !== null && canSign)) return
		setProcessing(true)
		try {
			let signature: SafeSignature | undefined = undefined
			let signatureStep2: SafeSignature | undefined = undefined
			let executed = false
			// Dirty way to handle the case when someone kicking himself.
			// In this case user will not be able to add signature bc of access rights
			// So we should add signature before we update the user, and avoid adding it twice
			let signatureAdded = false
			switch (proposal.type) {
				case "createAuction":
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
					;[signature] = await signApproveNFTForAuction(...signingArgs)
					signatureStep2 = await signCreateAuction(...signingArgs)
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
						await executeApproveNFTForAuction(
							proposal.gnosisAddress,
							proposal.nftId!,
							proposal.nftAddress!,
							[...proposal.signatures, signature],
							signer
						)
						await executeCreateAuction(
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
				case "cancelAuction":
					;[signature] = await signCancelAuction(
						proposal.gnosisAddress,
						proposal.auctionId!,
						signer
					)
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
						await executeCancelAuction(
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
						;[signature] = await signAddOwner(
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
						}
					} else {
						;[signature] = await signRemoveOwner(
							proposal.gnosisAddress,
							proposal.recipientAddress!,
							proposal.newThreshold!,
							signer
						)
						if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
							await addSafeProposalSignature({
								proposalId: id,
								signature: signature!,
								signatureStep2,
								...(executed ? {newState: "executed"} : {})
							})
							signatureAdded = true
							await executeRemoveOwner(
								proposal.gnosisAddress,
								proposal.recipientAddress!,
								proposal.newThreshold!,
								[...proposal.signatures, signature],
								signer
							)
							executed = true
						}
					}
					break
				case "decentralizeDAO":
					if (!proposal.multiTx) {
						throw new Error("Unexpected empty mulitTx in proposal")
					}
					if (!proposal.seeleAddress) {
						throw new Error("Unexpected empty seeleAddress in proposal")
					}
					;[signature] = await signMultiSend(proposal.multiTx, proposal.gnosisAddress, signer)
					if (proposal.signatures?.length === gnosisVotingThreshold - 1) {
						await executeMultiSend(
							proposal.multiTx,
							proposal.gnosisAddress,
							[signature, ...proposal.signatures],
							signer
						)
						await editDAO({
							gnosisAddress: proposal.gnosisAddress,
							seeleAddress: proposal.seeleAddress
						})
						executed = true
					}
					break
				default:
					throw new Error("Unexpected proposal type to sign")
			}
			if (!signatureAdded) {
				await addSafeProposalSignature({
					proposalId: id,
					signature: signature!,
					signatureStep2,
					...(executed ? {newState: "executed"} : {})
				})
			}
			toastSuccess("Successfully signed!")
		} catch (e) {
			console.error(e)
			toastError("Failed to sign proposal")
		}
		setProcessing(false)
	}

	return (
		<DAODashboard page="proposals" loading={loading} error={error} isAdmin={isAdmin} dao={dao}>
			<div className="proposal">
				<div className="proposal__header">
					<BackButton onClick={() => push(`/dao/${proposal.gnosisAddress}?page=proposals`)} />
					<div className="proposal__header-title">
						<h1>{proposal.title}</h1>
						<span>Linear Voting</span>
					</div>
					<div className="proposal__header-subtitle">
						<Tag variant={proposal.state}>{capitalize(proposal.state)}</Tag>
						<span>ID [ {id} ]</span>
						<span>•</span>
						<span>[ # ] Days, [ # ] Hours Left</span>
					</div>
					<div className="proposal__header-links">
						<p>
							Proposed by:
							<Link to={`/profile/${proposal.userAddress}`}>
								{formatReadableAddress(proposal.userAddress)}
							</Link>
						</p>
						<p>
							Voting Token:
							<Link to={`TODO`}>{formatReadableAddress(proposal.userAddress)}</Link>
						</p>
					</div>
				</div>
				<div className="proposal__content">
					<div className="proposal__content-heading">
						<span>Quorum Status</span> <Tag variant="canceled">75%</Tag>
					</div>
					<div className="proposal__content-body">
						<div className="proposal__content-votes-cards">
							<VotesCard type="for" tokensValue={500000} percentageValue={50} votes={MOCK_VOTES} />
							<VotesCard
								type="against"
								tokensValue={250000}
								percentageValue={25}
								votes={MOCK_VOTES}
							/>
							<VotesCard
								type="abstain"
								tokensValue={250000}
								percentageValue={25}
								votes={MOCK_VOTES}
							/>
						</div>
						<div className="proposal__content-details">
							<div className="proposal__content-details-left">
								<h2>Details</h2>
								{proposal.description && (
									<Expandable title="Description">{proposal.description}</Expandable>
								)}
								<Expandable title="Executable Code">
									{MOCK_TRANSACTIONS.map((transaction, idx) => (
										<Fragment key={idx}>
											<div className="proposal__transaction">
												<h3>Function {idx + 1}</h3>
												<div className="proposal__transaction-details">
													<p>Signature:</p>
													<span>{transaction.signature}</span>
													<p>Calldatas:</p>
													{transaction.inputs.map(input => (
														<p key={input.name} className="proposal__transaction-input">
															{input.name}: <span>{input.value}</span>
														</p>
													))}
													<p>Target:</p>
													<span>{transaction.to}</span>
													<p>Value:</p>
													<span>{transaction.value}</span>
												</div>
											</div>
											{idx + 1 !== MOCK_TRANSACTIONS.length && <Divider />}
										</Fragment>
									))}
								</Expandable>
							</div>
							<div className="proposal__content-details-right">
								<h2>Participate</h2>
							</div>
						</div>
					</div>
				</div>
			</div>
		</DAODashboard>
	)
}

export default Proposal
