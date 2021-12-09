import {formatEther} from "@ethersproject/units"
import {FunctionComponent, useContext, useState} from "react"
import {executeMultiSend, signMultiSend} from "../../../../api/ethers/functions/Usul/multiSend"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import editDAO from "../../../../api/firebase/DAO/editDAO"
import addSafeProposal from "../../../../api/firebase/safeProposal/addSafeProposal"
import {ReactComponent as ArrowDown} from "../../../../assets/icons/arrow-down.svg"
import {ReactComponent as WarningIcon} from "../../../../assets/icons/warning.svg"
import {AuthContext} from "../../../../context/AuthContext"
import EthersContext from "../../../../context/EthersContext"
import {formatReadableAddress} from "../../../../utlls"
import Button from "../../../Controls/Button"
import TransactionDetailsModal from "../../../Modals/TransactionDetailsModal"
import Copy from "../../../UI/Copy"
import Paper from "../../../UI/Paper"
import {toastError, toastSuccess} from "../../../UI/Toast"
import "./styles.scss"

const ConfirmDeployUsul: FunctionComponent<{
	multiTx?: SafeTransaction
	transactions: {tx: SafeTransaction; name: string}[]
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterSubmit: () => void
	expectedUsulAddress: string
}> = ({
	multiTx,
	transactions,
	gnosisAddress,
	gnosisVotingThreshold,
	afterSubmit,
	expectedUsulAddress
}) => {
	const {signer} = useContext(EthersContext)
	const {account, balance} = useContext(AuthContext)
	const [openedTxDetails, setOpenedTxDetails] = useState<
		{tx: SafeTransaction; name: string} | undefined
	>()
	const [loading, setLoading] = useState(false)

	const handleTxDetailsClose = () => {
		setOpenedTxDetails(undefined)
	}

	const handleSubmit = async () => {
		if (!signer) return
		setLoading(true)
		try {
			if (multiTx) {
				const [signature, nonce] = await signMultiSend(multiTx, gnosisAddress, signer)
				if (gnosisVotingThreshold === 1) {
					await executeMultiSend(multiTx, gnosisAddress, [signature], signer)
					await editDAO({
						gnosisAddress,
						usulAddress: expectedUsulAddress
					})
				}
				await addSafeProposal({
					type: "decentralizeDAO",
					gnosisAddress,
					nonce,
					multiTx,
					usulAddress: expectedUsulAddress,
					title: "Decentralize DAO",
					state: gnosisVotingThreshold === 1 ? "executed" : "active",
					signatures: [signature]
				})
				toastSuccess(
					gnosisVotingThreshold === 1
						? "Usul module successfully deployed"
						: "Expand DAO proposal successfully deployed"
				)
				afterSubmit()
			}
		} catch (e) {
			toastError("Failed to expand DAO")
			console.error(e)
		}
		setLoading(false)
	}

	const transactionsTotal = transactions.reduce(
		(current, {tx: {value}}) => current + Number(value),
		0
	)
	return (
		<Paper className="confirm-deploy-usul">
			<div className="confirm-deploy-usul__general-data">
				<div className="confirm-deploy-usul__general-data-row">
					<label>From</label>
					<Copy value={account}>{formatReadableAddress(account)}</Copy>
					{balance && (
						<span className="confirm-deploy-usul__data-balance">
							Balance: {formatEther(balance)} ETH
						</span>
					)}
				</div>
				<div className="confirm-deploy-usul__general-data-row">
					<div className="confirm-deploy-usul__general-data-col">
						<label>Send {transactionsTotal} ETH to</label>
						<Copy value={multiTx?.to}>{formatReadableAddress(multiTx?.to)}</Copy>
					</div>
					<div className="confirm-deploy-usul__general-data-col">
						<label>Data (Hex Encoded)</label>
						<Copy value={multiTx?.data}>{(multiTx?.data.length as number) / 2 - 2} bytes</Copy>
					</div>
				</div>
			</div>
			<ul className="confirm-deploy-usul__transaction-list">
				{transactions.map(({tx, name}) => (
					<li
						key={tx.data}
						className="confirm-deploy-usul__transaction-row"
						onClick={() => setOpenedTxDetails({tx, name})}
					>
						<div>
							<span>Contract Interaction</span>
						</div>
						<div>
							<span className="confirm-deploy-usul__transaction-name">{name}</span>
							<ArrowDown width="14px" height="7px" />
						</div>
					</li>
				))}
				<li
					className="confirm-deploy-usul__transaction-row"
					onClick={() => setOpenedTxDetails({tx: multiTx as SafeTransaction, name: "multiSend"})}
				>
					<div>
						<span>Contract Interaction</span>
					</div>
					<div>
						<span className="confirm-deploy-usul__transaction-name">multiSend</span>
						<ArrowDown width="14px" height="7px" />
					</div>
				</li>
				<TransactionDetailsModal
					transaction={openedTxDetails}
					show={!!openedTxDetails}
					onClose={handleTxDetailsClose}
				/>
			</ul>
			<div className="confirm-deploy-usul__warning-message">
				<WarningIcon width="20px" height="20px" />
				<span>
					{`This request will incur a gas fee. If you would like to proceed, please click "Confirm and
					Create Proposal" below.`}
				</span>
			</div>
			<Button
				disabled={loading}
				onClick={handleSubmit}
				extraClassName="confirm-deploy-usul__footer-button"
			>
				{loading
					? "Submitting..."
					: gnosisVotingThreshold === 1
					? "Confirm and Deploy Usul"
					: "Confirm and Create Proposal"}
			</Button>
		</Paper>
	)
}

export default ConfirmDeployUsul
