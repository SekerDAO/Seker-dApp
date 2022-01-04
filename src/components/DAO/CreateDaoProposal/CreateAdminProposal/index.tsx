import {FunctionComponent, useState} from "react"
import {SafeProposalsTypeNames, SafeProposalType} from "../../../../types/safeProposal"
import Input from "../../../Controls/Input"
import Select from "../../../Controls/Select"
import Divider from "../../../UI/Divider"
import ChangeRole from "./ChangeRole"
import GeneralEvmAdminProposal from "./GeneralEvmAdminProposal"

const CreateAdminProposal: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	ownersCount: number
}> = ({gnosisAddress, gnosisVotingThreshold, ownersCount}) => {
	const [type, setType] = useState<SafeProposalType>("changeRole")
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")

	const afterSubmit = () => {
		setTitle("")
		setDescription("")
	}

	return (
		<>
			<label>Safe proposal type</label>
			<Select<SafeProposalType>
				placeholder="Choose safe proposal type"
				value={type}
				options={[
					{name: SafeProposalsTypeNames.changeRole, value: "changeRole"},
					{name: SafeProposalsTypeNames.generalEVM, value: "generalEVM"}
				]}
				onChange={newSafeProposalType => {
					setType(newSafeProposalType as SafeProposalType)
				}}
			/>
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
			{type === "changeRole" && (
				<ChangeRole
					gnosisVotingThreshold={gnosisVotingThreshold}
					gnosisAddress={gnosisAddress}
					title={title}
					description={description}
					afterSubmit={afterSubmit}
					ownersCount={ownersCount}
				/>
			)}
			{type === "generalEVM" && (
				<GeneralEvmAdminProposal
					gnosisVotingThreshold={gnosisVotingThreshold}
					gnosisAddress={gnosisAddress}
					title={title}
					description={description}
					afterSubmit={afterSubmit}
				/>
			)}
		</>
	)
}

export default CreateAdminProposal
