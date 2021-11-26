import {FunctionComponent, useContext, useState} from "react"
import {AuthContext} from "../../../context/AuthContext"
import {VotingStrategy} from "../../../types/DAO"
import Select from "../../Controls/Select"
import CreateAdminProposal from "./CreateAdminProposal"
import CreateStrategyProposal from "./CreateStrategyProposal"

const CreateDaoProposal: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	ownersCount: number
	strategies: VotingStrategy[]
}> = ({gnosisAddress, gnosisVotingThreshold, ownersCount, strategies}) => {
	const {connected} = useContext(AuthContext)
	const [module, setModule] = useState<"admin" | VotingStrategy>("admin")

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
					},
					...strategies.map(strategy => ({
						name: strategy,
						value: strategy
					}))
				]}
				value={module}
				placeholder="Select Module"
				onChange={setModule}
			/>
			{module === "admin" ? (
				<CreateAdminProposal
					gnosisAddress={gnosisAddress}
					gnosisVotingThreshold={gnosisVotingThreshold}
					ownersCount={ownersCount}
				/>
			) : (
				<CreateStrategyProposal />
			)}
		</div>
	)
}

export default CreateDaoProposal
