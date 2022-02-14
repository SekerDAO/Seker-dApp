import {parse} from "query-string"
import {FunctionComponent, useContext, useEffect, useState} from "react"
import {useLocation} from "react-router-dom"
import buildBridgeTx from "../../../api/ethers/functions/AMB/buildBridgeTx"
import {
	executeProposalBatch,
	executeProposalSingle
} from "../../../api/ethers/functions/Usul/executeProposal"
import {buildMultiSendTx} from "../../../api/ethers/functions/Usul/multiSend"
import {finalizeVotingLinear} from "../../../api/ethers/functions/Usul/voting/OzLinearVoting/ozLinearVotingApi"
import {checkDelegatee} from "../../../api/ethers/functions/Usul/voting/votingApi"
import {prebuiltTxToSafeTx} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import addUsul from "../../../api/firebase/DAO/addUsul"
import {ReactComponent as WarningIcon} from "../../../assets/icons/warning.svg"
import config from "../../../config"
import {AuthContext} from "../../../context/AuthContext"
import ProviderContext from "../../../context/ProviderContext"
import useProposalVotes from "../../../hooks/getters/useProposalVotes"
import useSafeProposal from "../../../hooks/getters/useSafeProposal"
import useStrategyProposal from "../../../hooks/getters/useStrategyProposal"
import useCheckNetwork from "../../../hooks/useCheckNetwork"
import Button from "../../Controls/Button"
import AmbRedirectModal from "../../Modals/AmbRedirectModal"
import VotingModal from "../../Modals/VotingModal"
import ConnectWalletPlaceholder from "../../UI/ConnectWalletPlaceholder"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Loader"
import {toastError, toastSuccess} from "../../UI/Toast"
import ProposalLayout from "./ProposalLayout"
import "./styles.scss"
import useSignSafeProposal from "./useSignSafeProposal"

const SafeProposalContent: FunctionComponent<{id: string}> = ({id}) => {
	const {proposal, loading, error, canSign} = useSafeProposal(id)
	const {sign, processing} = useSignSafeProposal({proposal, canSign, id})

	if (error) return <ErrorPlaceholder />
	if (loading || !proposal) return <Loader />

	return (
		<ProposalLayout proposal={proposal} votesThreshold={proposal.gnosisVotingThreshold}>
			{proposal.state === "executed" ? (
				<p>This proposal has been confirmed and executed.</p>
			) : proposal.state === "outdated" ? (
				<p>
					This proposal is outdated because its signatures&apos; nonce is lower than actual safe
					nonce.
				</p>
			) : (
				<>
					<Button
						disabled={!canSign || processing}
						onClick={sign}
						extraClassName="proposal__content-vote-button"
					>
						Confirm
					</Button>
					<div className="proposal__content-participate-warning">
						<div>
							<WarningIcon width="20px" height="20px" />
						</div>
						<p>
							{`This request will incur a gas fee. If you would like to proceed, please
												click "Confirm".`}
						</p>
					</div>
				</>
			)}
		</ProposalLayout>
	)
}

const StrategyProposalContent: FunctionComponent<{id: string}> = ({id}) => {
	const {account, connected, signer} = useContext(AuthContext)
	const {provider, sideChainProvider} = useContext(ProviderContext)
	const {proposal, loading, error, refetch, userHasVoted, multiChain} = useStrategyProposal(id)
	const [showVotingModal, setShowVotingModal] = useState(false)
	const [finalizeTxHash, setFinalizeTxHash] = useState("")
	const [delegatee, setDelegatee] = useState<string | null>(null)
	const [processing, setProcessing] = useState(false)
	useEffect(() => {
		if (proposal?.govTokenAddress && account) {
			checkDelegatee(
				proposal.govTokenAddress,
				account,
				multiChain ? sideChainProvider : provider
			).then(res => {
				setDelegatee(res)
			})
		}
	}, [proposal, account])
	const {votes, loading: votesLoading} = useProposalVotes(proposal)

	const checkedFinalizeVotingLinear = useCheckNetwork(
		finalizeVotingLinear,
		multiChain ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)
	const checkedExecuteProposalSingle = useCheckNetwork(executeProposalSingle, config.SIDE_CHAIN_ID)
	const checkedExecuteProposalBatch = useCheckNetwork(executeProposalBatch, config.CHAIN_ID)

	if (loading || !proposal) return <Loader />
	if (error) return <ErrorPlaceholder />

	const handleFinalizeVoting = async () => {
		if (!signer) return
		try {
			setProcessing(true)
			switch (proposal.strategyType) {
				case "linearVoting":
					await checkedFinalizeVotingLinear(proposal.strategyAddress, proposal.id, signer)
					break
				default:
					throw new Error("Strategy not supported yet")
			}
			toastSuccess("Proposal successfully finalized")
			refetch()
		} catch (e) {
			console.error(e)
			toastError("Failed to finalize vote")
		}
		setProcessing(false)
	}

	const afterVote = () => {
		setShowVotingModal(false)
		refetch()
	}

	const handleExecute = async () => {
		if (!signer) return
		setProcessing(true)
		try {
			if (multiChain) {
				const txs = proposal.transactions.map(tx => prebuiltTxToSafeTx(tx))
				const hash = await checkedExecuteProposalSingle(
					proposal.usulAddress,
					proposal.id,
					await buildBridgeTx(
						await buildMultiSendTx(txs, proposal.gnosisAddress, undefined, false, true),
						proposal.usulBridgeAddress!
					),
					signer
				)
				setFinalizeTxHash(hash)
			} else {
				await checkedExecuteProposalBatch(
					proposal.usulAddress,
					proposal.id,
					proposal.transactions,
					signer
				)
				if (proposal.type === "deployUsul") {
					await addUsul({
						gnosisAddress: proposal.gnosisAddress,
						usul: {
							usulAddress: proposal.newUsulAddress!,
							deployType: proposal.bridgeAddress ? "usulMulti" : "usulSingle",
							bridgeAddress: proposal.bridgeAddress,
							sideNetSafeAddress: proposal.sideNetSafeAddress
						}
					})
				}
				toastSuccess("Proposal successfully executed")
				refetch()
			}
		} catch (e) {
			console.error(e)
			toastError("Failed to execute proposal")
		}
		setProcessing(false)
	}

	const voteDisabled =
		!(connected && proposal.state === "active") ||
		(!!proposal.govTokenAddress && !delegatee) ||
		userHasVoted

	return (
		<>
			{finalizeTxHash && (
				<AmbRedirectModal
					hash={finalizeTxHash}
					onClose={() => {
						setFinalizeTxHash("")
					}}
				/>
			)}
			<VotingModal
				show={showVotingModal}
				strategyAddress={proposal.strategyAddress}
				strategyName={proposal.strategyType}
				proposalId={proposal.id}
				afterSubmit={afterVote}
				onClose={() => {
					setShowVotingModal(false)
				}}
				sideChain={multiChain}
			/>
			<ProposalLayout
				proposal={{...proposal, multiChain}}
				votesThreshold={100}
				votes={votes}
				votesLoading={votesLoading}
			>
				{proposal.state === "active" ? (
					account && connected ? (
						<Button
							disabled={voteDisabled}
							extraClassName="proposal__content-vote-button"
							onClick={() => {
								setShowVotingModal(true)
							}}
						>
							{userHasVoted ? "Already voted" : "Vote"}
						</Button>
					) : (
						<ConnectWalletPlaceholder />
					)
				) : proposal.state === "pending" ? (
					account && connected && signer ? (
						<Button disabled={processing} onClick={handleFinalizeVoting}>
							Finalize Voting
						</Button>
					) : (
						<ConnectWalletPlaceholder />
					)
				) : proposal.state === "executing" ? (
					account && connected && signer ? (
						<Button disabled={processing} onClick={handleExecute}>
							Execute
						</Button>
					) : (
						<ConnectWalletPlaceholder />
					)
				) : proposal.state === "executed" ? (
					<p>This proposal has been passed and executed.</p>
				) : proposal.state === "timeLocked" ? (
					<p>This proposal has been passed and now is time locked</p>
				) : proposal.state === "canceled" ? (
					<p>This proposal is canceled.</p>
				) : proposal.state === "failed" ? (
					<p>This proposal has failed.</p>
				) : (
					<p>This proposal is not initialized.</p>
				)}
			</ProposalLayout>
		</>
	)
}

const Proposal: FunctionComponent = () => {
	const {search} = useLocation()
	const {id, type} = parse(search) as {id: string; type: string}

	return type === "safe" ? <SafeProposalContent id={id} /> : <StrategyProposalContent id={id} />
}

export default Proposal
