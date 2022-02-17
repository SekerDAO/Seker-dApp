import {FunctionComponent, useContext, useState} from "react"
import {getPrebuiltMultiSend} from "../../../../api/ethers/functions/Usul/multiSend"
import {submitProposal} from "../../../../api/ethers/functions/Usul/usulProposal"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import addStrategyProposal from "../../../../api/firebase/strategyProposal/addStrategyProposal"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import {VotingStrategyName} from "../../../../types/DAO"
import {toastError, toastSuccess} from "../../../UI/Toast"
import ConfirmTransactionsLayout from "./ConfirmTransactionsLayout"
import "./styles.scss"

const ConfirmUsulSingleStrategy: FunctionComponent<{
	multiTx: SafeTransaction
	transactions: {tx: SafeTransaction; name: string}[]
	gnosisAddress: string
	afterSubmit: () => void
	expectedUsulAddress: string
	votingUsulAddress: string
	votingStrategyAddress: string
	votingStrategyName: VotingStrategyName
}> = ({
	multiTx,
	transactions,
	gnosisAddress,
	afterSubmit,
	expectedUsulAddress,
	votingUsulAddress,
	votingStrategyAddress,
	votingStrategyName
}) => {
	const {account, signer} = useContext(AuthContext)
	const [loading, setLoading] = useState(false)

	const checkedSubmitProposal = useCheckNetwork(submitProposal)

	const handleSubmit = async () => {
		if (!(signer && account)) return
		setLoading(true)
		try {
			const proposalId = await checkedSubmitProposal(
				votingUsulAddress,
				votingStrategyAddress,
				[multiTx],
				signer
			)
			await addStrategyProposal({
				type: "deployUsul",
				gnosisAddress,
				id: proposalId,
				usulAddress: votingUsulAddress,
				strategyAddress: votingStrategyAddress,
				strategyType: votingStrategyName,
				title: "Deploy Usul",
				transactions: [getPrebuiltMultiSend(transactions.map(t => t.tx))],
				newUsulAddress: expectedUsulAddress
			})
			toastSuccess("Expand DAO proposal successfully created")
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
			submitText={"Confirm and Create Proposal"}
		/>
	)
}

export default ConfirmUsulSingleStrategy
