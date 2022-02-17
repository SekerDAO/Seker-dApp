import {FunctionComponent, useContext, useState} from "react"
import {executeMultiSend, signMultiSend} from "../../../../api/ethers/functions/Usul/multiSend"
import {
	getNonce,
	SafeSignature,
	SafeTransaction
} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import addUsul from "../../../../api/firebase/DAO/addUsul"
import addSafeProposal from "../../../../api/firebase/safeProposal/addSafeProposal"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import {toastError, toastSuccess} from "../../../UI/Toast"
import ConfirmTransactionsLayout from "./ConfirmTransactionsLayout"
import "./styles.scss"

const ConfirmUsulSingleAdmin: FunctionComponent<{
	multiTx: SafeTransaction
	transactions: {tx: SafeTransaction; name: string}[]
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterSubmit: () => void
	expectedUsulAddress: string
	isAdmin: boolean
}> = ({
	multiTx,
	transactions,
	gnosisAddress,
	gnosisVotingThreshold,
	afterSubmit,
	expectedUsulAddress,
	isAdmin
}) => {
	const {account, signer} = useContext(AuthContext)
	const [loading, setLoading] = useState(false)

	const checkedSignMultiSend = useCheckNetwork(signMultiSend)
	const checkedExecuteMultiSend = useCheckNetwork(executeMultiSend)
	const checkedGetNonce = useCheckNetwork(getNonce)

	const handleSubmit = async () => {
		if (!(signer && account)) return
		setLoading(true)
		try {
			const nonce = await checkedGetNonce(gnosisAddress, signer)
			let signature: SafeSignature
			if (isAdmin) {
				;[signature] = await checkedSignMultiSend(multiTx, gnosisAddress, signer)
				if (gnosisVotingThreshold === 1) {
					await checkedExecuteMultiSend(multiTx, gnosisAddress, [signature], signer)
					await addUsul({
						gnosisAddress,
						usul: {
							usulAddress: expectedUsulAddress,
							deployType: "usulSingle"
						}
					})
				}
			}
			await addSafeProposal({
				type: "decentralizeDAO",
				gnosisAddress,
				nonce,
				multiTx,
				usulAddress: expectedUsulAddress,
				title: "Decentralize DAO",
				state: gnosisVotingThreshold === 1 && isAdmin ? "executed" : "active",
				signatures: isAdmin ? [signature!] : [],
				usulDeployType: "usulSingle"
			})
			toastSuccess(
				gnosisVotingThreshold === 1 && isAdmin
					? "Usul module successfully deployed"
					: "Expand DAO proposal successfully created"
			)
			afterSubmit()
		} catch (e) {
			toastError("Failed to expand DAO")
			console.error(e)
		}
		setLoading(false)
	}

	return (
		<ConfirmTransactionsLayout
			transactions={transactions}
			multiTx={multiTx}
			loading={loading}
			onSubmit={handleSubmit}
			submitText={
				gnosisVotingThreshold === 1 && isAdmin
					? "Confirm and Deploy Usul"
					: "Confirm and Create Proposal"
			}
		/>
	)
}

export default ConfirmUsulSingleAdmin
