import {formatEther} from "@ethersproject/units"
import {FunctionComponent, useContext, useState} from "react"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import {ReactComponent as ArrowDown} from "../../../../assets/icons/arrow-down.svg"
import {ReactComponent as WarningIcon} from "../../../../assets/icons/warning.svg"
import {AuthContext} from "../../../../context/AuthContext"
import {formatReadableAddress} from "../../../../utlls"
import Button from "../../../Controls/Button"
import TransactionDetailsModal from "../../../Modals/TransactionDetailsModal"
import Copy from "../../../UI/Copy"
import Paper from "../../../UI/Paper"

const ConfirmTransactionsLayout: FunctionComponent<{
	transactions: {tx: SafeTransaction; name: string}[]
	multiTx: SafeTransaction
	loading: boolean
	onSubmit: () => Promise<void>
	submitText: string
}> = ({transactions, multiTx, loading, onSubmit, submitText}) => {
	const {account, balance} = useContext(AuthContext)
	const [openedTxDetails, setOpenedTxDetails] = useState<
		{tx: SafeTransaction; name: string} | undefined
	>()

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
						<Copy value={multiTx?.data}>{multiTx.data.length / 2 - 2} bytes</Copy>
					</div>
				</div>
			</div>
			<ul className="confirm-deploy-usul__transaction-list">
				{transactions.map(({tx, name}, index) => (
					<li
						key={index}
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
					onClose={() => {
						setOpenedTxDetails(undefined)
					}}
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
				onClick={onSubmit}
				extraClassName="confirm-deploy-usul__footer-button"
			>
				{loading ? "Submitting..." : submitText}
			</Button>
		</Paper>
	)
}

export default ConfirmTransactionsLayout
