import {FunctionComponent, useContext, useState} from "react"
import {
	executeMultiSend,
	getMultiSendTxBuild,
	signMultiSend
} from "../../../../api/ethers/functions/Usul/multiSend"
import addSafeProposal from "../../../../api/firebase/safeProposal/addSafeProposal"
import {AuthContext} from "../../../../context/AuthContext"
import {PrebuiltTx} from "../../../../types/common"
import {toastError, toastSuccess} from "../../../UI/Toast"
import GeneralEvm from "../GeneralEvm"

const GeneralEvmAdminProposal: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	title: string
	titleValidation: string | null
	description: string
	afterSubmit: () => void
}> = ({gnosisAddress, gnosisVotingThreshold, title, titleValidation, description, afterSubmit}) => {
	const {account, signer} = useContext(AuthContext)
	const [processing, setProcessing] = useState(false)

	const handleSubmit = async (txs: PrebuiltTx[]) => {
		if (!(title && !titleValidation && signer && account)) return
		setProcessing(true)
		try {
			const multiSendTx = await getMultiSendTxBuild(gnosisAddress, txs, signer)
			const [signature, nonce] = await signMultiSend(multiSendTx, gnosisAddress, signer)
			if (gnosisVotingThreshold === 1) {
				await executeMultiSend(multiSendTx, gnosisAddress, [signature], signer)
			}
			await addSafeProposal({
				type: "generalEVM",
				title,
				description,
				nonce,
				gnosisAddress,
				signatures: [signature],
				state: gnosisVotingThreshold === 1 ? "executed" : "active",
				transactions: txs
			})
			afterSubmit()
			toastSuccess(
				`Proposal successfully created${gnosisVotingThreshold === 1 ? " and executed" : ""}!`
			)
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
		setProcessing(false)
	}

	return (
		<GeneralEvm
			buttonDisabled={!title || !!titleValidation}
			processing={processing}
			onSubmit={handleSubmit}
		/>
	)
}

export default GeneralEvmAdminProposal
