import {FunctionComponent, useContext, useState} from "react"
import {getPrebuiltMultiSend} from "../../../../api/ethers/functions/Usul/multiSend"
import {submitProposal} from "../../../../api/ethers/functions/Usul/usulProposal"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import addStrategyProposal from "../../../../api/firebase/strategyProposal/addStrategyProposal"
import config from "../../../../config"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import {VotingStrategyName} from "../../../../types/DAO"
import {toastError, toastSuccess} from "../../../UI/Toast"
import ConfirmTransactionsLayout from "./ConfirmTransactionsLayout"
import "./styles.scss"

const ConfirmAddStrategies: FunctionComponent<{
	multiTx: SafeTransaction
	transactions: {tx: SafeTransaction; name: string}[]
	gnosisAddress: string
	afterSubmit: () => void
	usulAddress: string
	votingStrategyAddress: string
	votingStrategyName: VotingStrategyName
	sideChain: boolean
}> = ({
	multiTx,
	transactions,
	gnosisAddress,
	afterSubmit,
	usulAddress,
	votingStrategyAddress,
	votingStrategyName,
	sideChain
}) => {
	const {account, signer} = useContext(AuthContext)
	const [loading, setLoading] = useState(false)

	const checkedSubmitProposal = useCheckNetwork(
		submitProposal,
		sideChain ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)

	const handleSubmit = async () => {
		if (!(signer && account)) return
		setLoading(true)
		try {
			const proposalId = await checkedSubmitProposal(
				usulAddress,
				votingStrategyAddress,
				[multiTx],
				signer
			)
			await addStrategyProposal({
				type: "addStrategies",
				gnosisAddress,
				id: proposalId,
				usulAddress: usulAddress,
				strategyAddress: votingStrategyAddress,
				strategyType: votingStrategyName,
				title: "Add Strategies",
				transactions: [getPrebuiltMultiSend(transactions.map(t => t.tx))],
				sideChain
			})
			toastSuccess("Add strategies proposal successfully created")
			afterSubmit()
		} catch (e) {
			toastError("Failed to add strategies")
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
			submitText="Confirm and Create Proposal"
		/>
	)
}

export default ConfirmAddStrategies
