import {FunctionComponent} from "react"
import {SafeTransaction} from "../../../api/ethers/functions/gnosisSafe/safeUtils"
import Modal from "../Modal"

const TransactionDetailsModal: FunctionComponent<{
	show: boolean
	onClose: () => void
	transaction: {tx: SafeTransaction; name: string}
}> = ({show, onClose, transaction}) => {
	return <Modal show={show} onClose={onClose} title={transaction.name}></Modal>
}

export default TransactionDetailsModal
