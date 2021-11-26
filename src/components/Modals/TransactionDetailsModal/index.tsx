import {FunctionComponent} from "react"
import {SafeTransaction} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import {formatReadableAddress} from "../../../utlls"
import Copy from "../../UI/Copy"
import Modal from "../Modal"
import "./styles.scss"

const TransactionDetailsModal: FunctionComponent<{
	show: boolean
	onClose: () => void
	transaction?: {tx: SafeTransaction; name: string}
}> = ({show, onClose, transaction}) => {
	if (!transaction) {
		return null
	}
	const {name, tx} = transaction
	// TODO: decode tx.data and display from, to, gas from there
	return (
		<Modal show={show} onClose={onClose} title={`Contract Interaction ${name}`}>
			<div className="transaction-details__row">
				<label>Send {tx.value} ETH to</label>
				<Copy value={tx.to}>{formatReadableAddress(tx.to)}</Copy>
			</div>
			<div className="transaction-details__row">
				<label>Data (Hex Encoded)</label>
				<Copy value={tx.data}>{tx.data.length / 2 - 2} bytes</Copy>
			</div>
		</Modal>
	)
}

export default TransactionDetailsModal
