import {FunctionComponent, useContext, useState} from "react"
import {AuthContext} from "../../../context/AuthContext"
import {VotingStrategy} from "../../../types/DAO"
import Select from "../../Controls/Select"
import CreateAdminProposal from "./CreateAdminProposal"
import CreateStrategyProposal from "./CreateStrategyProposal"

const CreateDaoProposal: FunctionComponent<{
	gnosisAddress: string
	usulAddress?: string
	gnosisVotingThreshold: number
	ownersCount: number
	strategies: VotingStrategy[]
}> = ({gnosisAddress, usulAddress, gnosisVotingThreshold, ownersCount, strategies}) => {
	const {connected} = useContext(AuthContext)
	const [module, setModule] = useState(-1)

	if (!connected) return <div>TODO: Please connect wallet</div>

	return (
		<div className="create-dao-proposal">
			<h2>Create a New Proposal</h2>
			<label>Proposal module</label>
			<Select
				options={[
					{
						name: "Admin",
						value: -1
					},
					...strategies.map((strategy, index) => ({
						name: strategy.name,
						value: index
					}))
				]}
				value={module}
				placeholder="Select Module"
				onChange={setModule}
			/>
			{module === -1 && (
				<CreateAdminProposal
					gnosisAddress={gnosisAddress}
					gnosisVotingThreshold={gnosisVotingThreshold}
					ownersCount={ownersCount}
				/>
			)}{" "}
			{module > -1 && usulAddress && (
				<CreateStrategyProposal
					gnosisAddress={gnosisAddress}
					usulAddress={usulAddress}
					strategyAddress={strategies[module].address}
					strategyType={strategies[module].name}
				/>
			)}
		</div>
	)
}

export default CreateDaoProposal
