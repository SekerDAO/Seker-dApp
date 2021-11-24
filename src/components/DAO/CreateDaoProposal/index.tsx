import {FunctionComponent, useContext, useState} from "react"
import {AuthContext} from "../../../context/AuthContext"
import Select from "../../Controls/Select"
import CreateAdminProposal from "./CreateAdminProposal"

const CreateDaoProposal: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	ownersCount: number
}> = ({gnosisAddress, gnosisVotingThreshold, ownersCount}) => {
	const {connected} = useContext(AuthContext)
	const [module, setModule] = useState("admin")

	if (!connected) return <div>TODO: Please connect wallet</div>

	return (
		<div className="create-dao-proposal">
			<h2>Create a New Proposal</h2>
			<label>Proposal module</label>
			<Select
				options={[
					{
						name: "Admin",
						value: "admin"
					}
				]}
				value={module}
				placeholder="Select Module"
				onChange={setModule}
			/>
			{module === "admin" && (
				<CreateAdminProposal
					gnosisAddress={gnosisAddress}
					gnosisVotingThreshold={gnosisVotingThreshold}
					ownersCount={ownersCount}
				/>
			)}
		</div>
	)
}

export default CreateDaoProposal
