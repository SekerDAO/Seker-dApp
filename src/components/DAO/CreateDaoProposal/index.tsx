import {FunctionComponent, useContext, useState} from "react"
import {VOTING_STRATEGIES} from "../../../constants/votingStrategies"
import {AuthContext} from "../../../context/AuthContext"
import {UsulDeployType, VotingStrategy} from "../../../types/DAO"
import Select from "../../Controls/Select"
import ConnectWalletPlaceholder from "../../UI/ConnectWalletPlaceholder"
import CreateAdminProposal from "./CreateAdminProposal"
import CreateStrategyProposal from "./CreateStrategyProposal"
import "./styles.scss"

const CreateDaoProposal: FunctionComponent<{
	gnosisAddress: string
	usulAddress?: string
	gnosisVotingThreshold: number
	ownersCount: number
	strategies: VotingStrategy[]
	isAdmin: boolean
	usulDeployType?: UsulDeployType
	bridgeAddress?: string
}> = ({
	gnosisAddress,
	usulAddress,
	gnosisVotingThreshold,
	ownersCount,
	strategies,
	isAdmin,
	usulDeployType,
	bridgeAddress
}) => {
	const {connected} = useContext(AuthContext)
	const [module, setModule] = useState(isAdmin ? -1 : 0)

	if (!connected) return <ConnectWalletPlaceholder />

	return (
		<div className="create-dao-proposal">
			<h2>Create a New Proposal</h2>
			<label>Proposal module</label>
			<Select
				options={[
					...(isAdmin
						? [
								{
									name: "Admin",
									value: -1
								}
						  ]
						: []),
					...strategies.map((strategy, index) => ({
						name: VOTING_STRATEGIES.find(s => s.strategy === strategy.name)?.title ?? strategy.name,
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
			{module > -1 && usulAddress && usulDeployType && (
				<CreateStrategyProposal
					gnosisAddress={gnosisAddress}
					usulAddress={usulAddress}
					strategyAddress={strategies[module].address}
					strategyType={strategies[module].name}
					usulDeployType={usulDeployType}
					bridgeAddress={bridgeAddress}
				/>
			)}
		</div>
	)
}

export default CreateDaoProposal
