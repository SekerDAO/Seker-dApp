import {FunctionComponent, useContext, useState} from "react"
import {buildMultiSendTx} from "../../../../api/ethers/functions/Usul/multiSend"
import {
	buildProposalTxMultiChain,
	submitProposal
} from "../../../../api/ethers/functions/Usul/usulProposal"
import {prebuiltTxToSafeTx} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import addStrategyProposal from "../../../../api/firebase/strategyProposal/addStrategyProposal"
import config from "../../../../config"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import useValidation from "../../../../hooks/useValidation"
import {UsulDeployType, VotingStrategyName} from "../../../../types/DAO"
import {PrebuiltTx} from "../../../../types/common"
import {noSpecialCharsRegex} from "../../../../utlls"
import Input from "../../../Controls/Input"
import Divider from "../../../UI/Divider"
import {toastError, toastSuccess} from "../../../UI/Toast"
import GeneralEvm from "../GeneralEvm"

const CreateStrategyProposal: FunctionComponent<{
	gnosisAddress: string
	usulAddress: string
	strategyAddress: string
	bridgeAddress?: string
	strategyType: VotingStrategyName
	usulDeployType: UsulDeployType
}> = ({
	gnosisAddress,
	usulAddress,
	bridgeAddress,
	strategyAddress,
	strategyType,
	usulDeployType
}) => {
	const {account, signer} = useContext(AuthContext)
	const [processing, setProcessing] = useState(false)
	const [title, setTitle] = useState("")
	const {validation} = useValidation(title, [
		async val => (!val || noSpecialCharsRegex.test(val) ? null : "Not a valid title")
	])
	const [description, setDescription] = useState("")

	const checkedSubmitProposal = useCheckNetwork(
		submitProposal,
		usulDeployType === "usulMulti" ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)

	const handleSubmit = async (transactions: PrebuiltTx[]) => {
		if (!(title && !validation && signer && account)) return
		setProcessing(true)
		try {
			const txs = transactions.map(tx =>
				prebuiltTxToSafeTx(tx.address, tx.contractMethods, tx.selectedMethodIndex, tx.args)
			)
			const proposalId = await checkedSubmitProposal(
				usulAddress,
				strategyAddress,
				usulDeployType === "usulMulti"
					? [
							await buildProposalTxMultiChain(
								await buildMultiSendTx(txs, gnosisAddress, undefined, false, true),
								gnosisAddress,
								bridgeAddress!
							)
					  ]
					: txs,
				signer
			)
			await addStrategyProposal({
				gnosisAddress,
				strategyAddress,
				strategyType,
				id: proposalId,
				transactions,
				title,
				description
			})
			setTitle("")
			setDescription("")
			toastSuccess("Proposal successfully created!")
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
		setProcessing(false)
	}

	return (
		<>
			<label htmlFor="change-role-title">Title</label>
			<Input
				id="change-role-title"
				onChange={e => {
					setTitle(e.target.value)
				}}
				value={title}
			/>
			<label htmlFor="change-role-desc">Description</label>
			<Input
				id="change-role-desc"
				onChange={e => {
					setDescription(e.target.value)
				}}
				value={description}
			/>
			<Divider />
			<GeneralEvm
				buttonDisabled={!title || !!validation}
				processing={processing}
				onSubmit={handleSubmit}
			/>
		</>
	)
}

export default CreateStrategyProposal
