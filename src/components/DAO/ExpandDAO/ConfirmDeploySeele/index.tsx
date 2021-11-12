import {FunctionComponent, useContext, useState, useEffect} from "react"
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

const ConfirmDeploySeele: FunctionComponent<{
	transactions: {tx: SafeTransaction; name: string}[]
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterSubmit: () => void
	onGoBack: () => void
	expectedSeeleAddress: string
}> = ({
	transactions,
	gnosisAddress,
	gnosisVotingThreshold,
	afterSubmit,
	expectedSeeleAddress,
	onGoBack
}) => {
	const {signer} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)
	const [signerAddress, setSignerAddress] = useState<string | undefined>()
	const [signerBalance, setSignerBalance] = useState<string | undefined>()
	const multiTx = transactions.find(tx => tx.name === "multiSend")
	useEffect(() => {
		const loadSignerDetails = async () => {
			setSignerAddress(await signer?.getAddress())
			setSignerBalance(await (await signer?.getBalance())?.toString())
		}
		loadSignerDetails()
	}, [signer])

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
			<h2>Confirm Bundle Transactions</h2>
			<div className="confirm-deploy-seele__general-data">
				<div className="confirm-deploy-seele__general-data-row">
					<label>From</label>
					<div className="copy-field">{signerAddress}</div>
					<span className="confirm-deploy-seele__data-balance">Balance: {signerBalance} ETH</span>
				</div>
				<div className="confirm-deploy-seele__general-data-row">
					<div className="confirm-deploy-seele__general-data-col">
						<label>Send {transactionsTotal} ETH to</label>
						<div className="copy-field">{signerAddress}</div>
					</div>
					<div className="confirm-deploy-seele__general-data-col">
						<label>Data (Hex Encoded)</label>
						<div className="copy-field">{multiTx?.tx.data.length} bytes</div>
					</div>
				</div>
			</div>
			<ul className="confirm-deploy-seele__transaction-list">
				{transactions.map(({tx, name}) => (
					<li key={tx.data} className="confirm-deploy-seele__transaction-row">
						<div>
							<span>Contract Deployment</span>
						</div>
						<div>
							<span className="confirm-deploy-seele__transaction-name">{name}</span>
							<ArrowDown width="14px" height="7px" />
						</div>
					</li>
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
				buttonType="secondary"
				disabled={loading}
				onClick={onGoBack}
				extraClassName="confirm-deploy-seele__footer-button"
			>
				Back
			</Button>
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
