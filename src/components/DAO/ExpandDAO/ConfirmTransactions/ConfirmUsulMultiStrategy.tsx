import {FunctionComponent, useContext, useState} from "react"
import deployBridge from "../../../../api/ethers/functions/AMB/deployBridge"
import {executeMultiSend, signMultiSend} from "../../../../api/ethers/functions/Usul/multiSend"
import {submitProposal} from "../../../../api/ethers/functions/Usul/usulProposal"
import createGnosisSafe from "../../../../api/ethers/functions/gnosisSafe/createGnosisSafe"
import {
	getPrebuiltRegisterModuleTx,
	getRegisterModuleTx
} from "../../../../api/ethers/functions/gnosisSafe/registerModule"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import addStrategyProposal from "../../../../api/firebase/strategyProposal/addStrategyProposal"
import config from "../../../../config"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import {VotingStrategyName} from "../../../../types/DAO"
import {toastError, toastSuccess} from "../../../UI/Toast"
import ConfirmTransactionsLayout from "./ConfirmTransactionsLayout"
import "./styles.scss"

const ConfirmUsulMultiStrategy: FunctionComponent<{
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

	const checkedDeploySideNetSafe = useCheckNetwork(createGnosisSafe, config.SIDE_CHAIN_ID)
	const checkedSignMultiSend = useCheckNetwork(signMultiSend, config.SIDE_CHAIN_ID)
	const checkedExecuteMultiSend = useCheckNetwork(executeMultiSend, config.SIDE_CHAIN_ID)
	const checkedDeployBridge = useCheckNetwork(deployBridge)
	const checkedSubmitProposal = useCheckNetwork(submitProposal)

	const handleSubmit = async () => {
		if (!(signer && account)) return
		setLoading(true)
		try {
			const sideNetSafeAddress = await checkedDeploySideNetSafe([account], 1, signer, false, true)
			const [multiSendSignature] = await checkedSignMultiSend(multiTx, sideNetSafeAddress, signer)
			await checkedExecuteMultiSend(multiTx, sideNetSafeAddress, [multiSendSignature], signer)
			// TODO: burn admins
			const bridgeAddress = await checkedDeployBridge(gnosisAddress, sideNetSafeAddress, signer)
			const proposalId = await checkedSubmitProposal(
				votingUsulAddress,
				votingStrategyAddress,
				[await getRegisterModuleTx(gnosisAddress, bridgeAddress)],
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
				transactions: [getPrebuiltRegisterModuleTx(gnosisAddress, bridgeAddress)],
				newUsulAddress: expectedUsulAddress,
				sideNetSafeAddress,
				bridgeAddress
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
			submitText="Confirm and Create Proposal"
		/>
	)
}

export default ConfirmUsulMultiStrategy
