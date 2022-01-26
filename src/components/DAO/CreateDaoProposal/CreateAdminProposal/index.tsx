import {FunctionComponent, useState} from "react"
import {useHistory, useLocation} from "react-router-dom"
import useValidation from "../../../../hooks/useValidation"
import {SafeProposalsTypeNames, SafeProposalType} from "../../../../types/safeProposal"
import {noSpecialCharsRegex} from "../../../../utlls"
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
	const {validation} = useValidation(title, [
		async val => (!val || noSpecialCharsRegex.test(val) ? null : "Not a valid title")
	])
	const [description, setDescription] = useState("")
	const {push} = useHistory()
	const {pathname} = useLocation()

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
			{type === "changeRole" && (
				<ChangeRole
					gnosisVotingThreshold={gnosisVotingThreshold}
					gnosisAddress={gnosisAddress}
					title={title}
					titleValidation={validation}
					description={description}
					afterSubmit={() => {
						push(`${pathname}?page=proposals`)
					}}
					ownersCount={ownersCount}
				/>
			)}
			{type === "generalEVM" && (
				<GeneralEvmAdminProposal
					gnosisVotingThreshold={gnosisVotingThreshold}
					gnosisAddress={gnosisAddress}
					title={title}
					titleValidation={validation}
					description={description}
					afterSubmit={() => {
						push(`${pathname}?page=proposals`)
					}}
				/>
			)}
		</>
	)
}

export default CreateAdminProposal
