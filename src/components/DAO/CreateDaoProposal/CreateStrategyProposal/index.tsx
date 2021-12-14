import {FunctionComponent, useContext, useState} from "react"
import {buildProposalTx, submitProposal} from "../../../../api/ethers/functions/Usul/usulProposal"
import addStrategyProposal from "../../../../api/firebase/strategyProposal/addStrategyProposal"
import {AuthContext} from "../../../../context/AuthContext"
import EthersContext from "../../../../context/EthersContext"
import {VotingStrategyName} from "../../../../types/DAO"
import {PrebuiltTx} from "../../../../types/common"
import Input from "../../../Controls/Input"
import Divider from "../../../UI/Divider"
import {toastError, toastSuccess} from "../../../UI/Toast"
import GeneralEvm from "../GeneralEvm"

const CreateStrategyProposal: FunctionComponent<{
	gnosisAddress: string
	usulAddress: string
	strategyAddress: string
	strategyType: VotingStrategyName
}> = ({gnosisAddress, usulAddress, strategyAddress, strategyType}) => {
	const {account} = useContext(AuthContext)
	const {signer, provider} = useContext(EthersContext)
	const [processing, setProcessing] = useState(false)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")

	const handleSubmit = async (transactions: PrebuiltTx[]) => {
		if (!(title && signer && account)) return
		setProcessing(true)
		try {
			const txHashes = transactions.map(tx =>
				buildProposalTx(tx.address, tx.contractMethods, tx.selectedMethodIndex, tx.args, provider)
			)
			const proposalId = await submitProposal(usulAddress, strategyAddress, txHashes, signer)
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
			<GeneralEvm buttonDisabled={!title} processing={processing} onSubmit={handleSubmit} />
		</>
	)
}

export default CreateStrategyProposal
