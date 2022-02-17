import {FunctionComponent, useContext, useState} from "react"
import deployBridge from "../../../../api/ethers/functions/AMB/deployBridge"
import {executeMultiSend, signMultiSend} from "../../../../api/ethers/functions/Usul/multiSend"
import createGnosisSafe from "../../../../api/ethers/functions/gnosisSafe/createGnosisSafe"
import {
	executeRegisterModuleTx,
	signRegisterModuleTx
} from "../../../../api/ethers/functions/gnosisSafe/registerModule"
import {
	getNonce,
	SafeSignature,
	SafeTransaction
} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import addUsul from "../../../../api/firebase/DAO/addUsul"
import addSafeProposal from "../../../../api/firebase/safeProposal/addSafeProposal"
import config from "../../../../config"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import {toastError, toastSuccess} from "../../../UI/Toast"
import ConfirmTransactionsLayout from "./ConfirmTransactionsLayout"
import "./styles.scss"

const ConfirmUsulMultiAdmin: FunctionComponent<{
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

	const checkedDeploySideNetSafe = useCheckNetwork(createGnosisSafe, config.SIDE_CHAIN_ID)
	const checkedSignMultiSend = useCheckNetwork(signMultiSend, config.SIDE_CHAIN_ID)
	const checkedExecuteMultiSend = useCheckNetwork(executeMultiSend, config.SIDE_CHAIN_ID)
	const checkedDeployBridge = useCheckNetwork(deployBridge)
	const checkedSignRegisterModule = useCheckNetwork(signRegisterModuleTx)
	const checkedExecuteRegisterModule = useCheckNetwork(executeRegisterModuleTx)
	const checkedGetNonce = useCheckNetwork(getNonce)

	const handleSubmit = async () => {
		if (!(signer && account)) return
		setLoading(true)
		try {
			const sideNetSafeAddress = await checkedDeploySideNetSafe([account], 1, signer, false, true)
			const [multiSendSignature] = await checkedSignMultiSend(multiTx, sideNetSafeAddress, signer)
			await checkedExecuteMultiSend(multiTx, sideNetSafeAddress, [multiSendSignature], signer)
			// TODO: burn admins
			const bridgeAddress = await checkedDeployBridge(gnosisAddress, sideNetSafeAddress, signer)
			const nonce = await checkedGetNonce(gnosisAddress, signer)
			let registerBridgeSignature: SafeSignature
			if (isAdmin) {
				;[registerBridgeSignature] = await checkedSignRegisterModule(
					gnosisAddress,
					bridgeAddress,
					signer
				)
				if (gnosisVotingThreshold === 1) {
					await checkedExecuteRegisterModule(
						gnosisAddress,
						bridgeAddress,
						[registerBridgeSignature],
						signer
					)
					await addUsul({
						gnosisAddress,
						usul: {
							usulAddress: expectedUsulAddress,
							deployType: "usulMulti",
							bridgeAddress,
							sideNetSafeAddress
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
				sideNetSafeAddress,
				bridgeAddress,
				title: "Decentralize DAO",
				state: gnosisVotingThreshold === 1 && isAdmin ? "executed" : "active",
				signatures: isAdmin ? [registerBridgeSignature!] : [],
				usulDeployType: "usulMulti"
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

export default ConfirmUsulMultiAdmin
