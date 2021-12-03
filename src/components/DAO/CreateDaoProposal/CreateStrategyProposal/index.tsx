import {FunctionComponent, useContext, useState} from "react"
import {buildProposalTx, submitProposal} from "../../../../api/ethers/functions/Usul/usulProposal"
import addStrategyProposal from "../../../../api/firebase/strategyProposal/addStrategyProposal"
import {AuthContext} from "../../../../context/AuthContext"
import EthersContext from "../../../../context/EthersContext"
import {VotingStrategyName} from "../../../../types/DAO"
import {AbiFunction} from "../../../../types/abi"
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

	const handleSubmit = async (
		address: string,
		contractMethods: AbiFunction[],
		selectedMethodIndex: number,
		args: (string | string[])[]
	) => {
		if (!(title && signer && account)) return
		setProcessing(true)
		try {
			const tx = await buildProposalTx(
				address,
				contractMethods,
				contractMethods[selectedMethodIndex].name,
				args,
				provider
			)
			const proposalId = await submitProposal(usulAddress, strategyAddress, [tx], signer)
			await addStrategyProposal({
				gnosisAddress,
				strategyAddress,
				strategyType,
				id: proposalId,
				contractAddress: address,
				contractAbi: contractMethods,
				contractMethod: contractMethods[selectedMethodIndex].name,
				title,
				description,
				args,
				state: "active"
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
