import {FunctionComponent, useContext, useState} from "react"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import {toastError} from "../../../UI/Toast"
import {
	buildMultiSendTx,
	executeMultiSend,
	signMultiSend
} from "../../../../api/ethers/functions/Seele/multiSend"
import editDAO from "../../../../api/firebase/DAO/editDAO"
import addSafeProposal from "../../../../api/firebase/safeProposal/addSafeProposal"
import EthersContext from "../../../../context/EthersContext"
import "./styles.scss"
import Table from "../../../UI/Table"
import Button from "../../../Controls/Button"

const ReviewDeploySeele: FunctionComponent<{
	transactions: {tx: SafeTransaction; name: string}[]
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterSubmit: () => void
	expectedSeeleAddress: string
}> = ({transactions, gnosisAddress, gnosisVotingThreshold, afterSubmit, expectedSeeleAddress}) => {
	const {signer} = useContext(EthersContext)
	const [loading, setLoading] = useState(false)

	const handleSubmit = async () => {
		if (!signer) return
		setLoading(true)
		try {
			const multiTx = await buildMultiSendTx(
				transactions.map(t => t.tx),
				gnosisAddress,
				signer
			)
			const [signature, nonce] = await signMultiSend(multiTx, gnosisAddress, signer)
			if (gnosisVotingThreshold === 1) {
				await executeMultiSend(multiTx, gnosisAddress, [signature], signer)
				await editDAO({
					gnosisAddress,
					seeleAddress: expectedSeeleAddress
				})
			}
			await addSafeProposal({
				type: "decentralizeDAO",
				gnosisAddress,
				nonce,
				seeleAddress: expectedSeeleAddress,
				title: "Decentralize DAO",
				state: gnosisVotingThreshold === 1 ? "executed" : "active",
				signatures: [signature],
				multiTx
			})
			afterSubmit()
		} catch (e) {
			toastError("Failed to expand DAO")
			console.error(e)
		}
		setLoading(false)
	}

	return (
		<div className="review-deploy-seele">
			<div>TODO: stylish this</div>
			<Table
				data={transactions.map((tx, idx) => ({
					idx,
					name: tx.name,
					to: tx.tx.to,
					safeTxGas: tx.tx.safeTxGas
				}))}
				columns={[
					{
						id: "name",
						name: "Name"
					},
					{
						id: "to",
						name: "to"
					},
					{
						id: "safeTxGas",
						name: "safeTxGas"
					}
				]}
				idCol="idx"
			/>
			<Button disabled={loading} onClick={handleSubmit}>
				{loading ? "Submitting..." : "Submit"}
			</Button>
		</div>
	)
}

export default ReviewDeploySeele
