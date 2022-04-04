import {FunctionComponent, useContext, useState} from "react"
import {useHistory, useLocation} from "react-router-dom"
import buildBridgeTx from "../../../../api/ethers/functions/AMB/buildBridgeTx"
import {buildMultiSendTx} from "../../../../api/ethers/functions/Usul/multiSend"
import {submitProposal} from "../../../../api/ethers/functions/Usul/usulProposal"
import {prebuiltTxToSafeTx} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"
import addStrategyProposal from "../../../../api/firebase/strategyProposal/addStrategyProposal"
import config from "../../../../config"
import networks from "../../../../constants/networks"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import useValidation from "../../../../hooks/useValidation"
import {UsulDeployType, VotingStrategyName} from "../../../../types/DAO"
import {PrebuiltTx} from "../../../../types/common"
import {noSpecialCharsRegex} from "../../../../utlls"
import Input from "../../../Controls/Input"
import Select from "../../../Controls/Select"
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
	const [sideChain, setSideChain] = useState(false)
	const {push} = useHistory()
	const {pathname} = useLocation()

	const checkedSubmitProposal = useCheckNetwork(
		submitProposal,
		usulDeployType === "usulMulti" ? config.SIDE_CHAIN_ID : config.CHAIN_ID
	)

	const handleSubmit = async (transactions: PrebuiltTx[]) => {
		if (!(title && !validation && signer && account)) return
		setProcessing(true)
		try {
			const txs = transactions.map(tx => prebuiltTxToSafeTx(tx))
			const proposalId = await checkedSubmitProposal(
				usulAddress,
				strategyAddress,
				usulDeployType === "usulMulti" && sideChain
					? [
							await buildBridgeTx(
								await buildMultiSendTx(txs, gnosisAddress, undefined, false, true),
								bridgeAddress!
							)
					  ]
					: txs,
				signer
			)
			await addStrategyProposal({
				gnosisAddress,
				usulAddress,
				strategyAddress,
				strategyType,
				id: proposalId,
				transactions,
				title,
				description,
				type: "generalEvm",
				sideChain
			})
			toastSuccess("Proposal successfully created!")
			push(`${pathname}?page=proposals`)
		} catch (e) {
			console.error(e)
			toastError("Failed to create proposal")
		}
		setProcessing(false)
	}

	return (
		<>
			{usulDeployType === "usulMulti" && (
				<>
					<label htmlFor="change-role-chain">Target Chain</label>
					<Select
						options={[
							{
								name: networks[config.CHAIN_ID],
								value: config.CHAIN_ID
							},
							{
								name: networks[config.SIDE_CHAIN_ID],
								value: config.SIDE_CHAIN_ID
							}
						]}
						placeholder="Select chain"
						onChange={value => setSideChain(value === config.SIDE_CHAIN_ID)}
						value={sideChain ? config.SIDE_CHAIN_ID : config.CHAIN_ID}
					/>
				</>
			)}
			<label htmlFor="change-role-title">Title</label>
			<Input
				id="change-role-title"
				onChange={e => {
					setTitle(e.target.value)
				}}
				value={title}
				validation={validation}
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
