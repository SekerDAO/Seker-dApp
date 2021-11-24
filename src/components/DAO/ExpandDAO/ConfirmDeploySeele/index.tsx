import {FunctionComponent, Fragment, useContext, useState} from "react"
import {formatEther} from "@ethersproject/units"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import {toastError} from "../../../UI/Toast"
import {executeMultiSend, signMultiSend} from "../../../../api/ethers/functions/Seele/multiSend"
import editDAO from "../../../../api/firebase/DAO/editDAO"
import addSafeProposal from "../../../../api/firebase/safeProposal/addSafeProposal"
import EthersContext from "../../../../context/EthersContext"
import Button from "../../../Controls/Button"
import {ReactComponent as WarningIcon} from "../../../../assets/icons/warning.svg"
import {ReactComponent as ArrowDown} from "../../../../assets/icons/arrow-down.svg"
import "./styles.scss"
import Paper from "../../../UI/Paper"
import CopyField from "../../../UI/Copy"
import {formatReadableAddress} from "../../../../utlls"
import TransactionDetailsModal from "../../../Modals/TransactionDetailsModal"
import {AuthContext} from "../../../../context/AuthContext"

const ConfirmDeploySeele: FunctionComponent<{
	transactions: {tx: SafeTransaction; name: string}[]
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterSubmit: () => void
	expectedSeeleAddress: string
}> = ({transactions, gnosisAddress, gnosisVotingThreshold, afterSubmit, expectedSeeleAddress}) => {
	const {signer} = useContext(EthersContext)
	const {account, balance} = useContext(AuthContext)
	const [openedTxDetails, setOpenedTxDetails] = useState<number | undefined>()
	const [loading, setLoading] = useState(false)
	const multiTx = transactions.find(tx => tx.name === "multiSend")

	const handleTxDetailsClose = () => {
		setOpenedTxDetails(undefined)
	}

	const handleSubmit = async () => {
		if (!signer) return
		setLoading(true)
		try {
			if (multiTx) {
				const signature = await signMultiSend(multiTx.tx, gnosisAddress, signer)
				if (gnosisVotingThreshold === 1) {
					await executeMultiSend(multiTx.tx, gnosisAddress, [signature], signer)
					await editDAO({
						gnosisAddress,
						seeleAddress: expectedSeeleAddress
					})
				}
				await addSafeProposal({
					type: "decentralizeDAO",
					gnosisAddress,
					seeleAddress: expectedSeeleAddress,
					title: "Decentralize DAO",
					state: gnosisVotingThreshold === 1 ? "executed" : "active",
					signatures: [signature],
					multiTx: multiTx.tx
				})
				afterSubmit()
			}
		} catch (e) {
			toastError("Failed to expand DAO")
			console.error(e)
		}
		setLoading(false)
	}

	const transactionsTotal = transactions.reduce((current, {tx: {value}}) => current + +value, 0)
	return (
		<Paper className="confirm-deploy-seele">
			<div className="confirm-deploy-seele__general-data">
				<div className="confirm-deploy-seele__general-data-row">
					<label>From</label>
					<CopyField value={account}>{formatReadableAddress(account)}</CopyField>
					{balance && (
						<span className="confirm-deploy-seele__data-balance">
							Balance: {formatEther(balance)} ETH
						</span>
					)}
				</div>
				<div className="confirm-deploy-seele__general-data-row">
					<div className="confirm-deploy-seele__general-data-col">
						<label>Send {transactionsTotal} ETH to</label>
						<CopyField value={multiTx?.tx.to}>{formatReadableAddress(multiTx?.tx.to)}</CopyField>
					</div>
					<div className="confirm-deploy-seele__general-data-col">
						<label>Data (Hex Encoded)</label>
						<CopyField value={multiTx?.tx.data}>
							{(multiTx?.tx.data.length as number) / 2 - 2} bytes
						</CopyField>
					</div>
				</div>
			</div>
			<ul className="confirm-deploy-seele__transaction-list">
				{transactions.map(({tx, name}, index) => (
					<Fragment key={tx.data}>
						<li
							key={tx.data}
							className="confirm-deploy-seele__transaction-row"
							onClick={() => setOpenedTxDetails(index)}
						>
							<div>
								<span>Contract Interaction</span>
							</div>
							<div>
								<span className="confirm-deploy-seele__transaction-name">{name}</span>
								<ArrowDown width="14px" height="7px" />
							</div>
						</li>
						<TransactionDetailsModal
							transaction={{tx, name}}
							show={openedTxDetails === index}
							onClose={handleTxDetailsClose}
						/>
					</Fragment>
				))}
			</ul>
			<div className="confirm-deploy-seele__warning-message">
				<WarningIcon width="20px" height="20px" />
				<span>
					{`This request will incur a gas fee. If you would like to proceed, please click "Confirm and
					Create Proposal" below.`}
				</span>
			</div>
			<Button
				disabled={loading}
				onClick={handleSubmit}
				extraClassName="confirm-deploy-seele__footer-button"
			>
				{loading
					? "Submitting..."
					: gnosisVotingThreshold
					? "Confirm and Deploy Seele"
					: "Confirm and Create Proposal"}
			</Button>
		</Paper>
	)
}

export default ConfirmDeploySeele
