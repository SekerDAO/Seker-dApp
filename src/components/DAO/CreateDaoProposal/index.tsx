import {FunctionComponent, useContext, useState} from "react"
import config from "../../../config"
import networks from "../../../constants/networks"
import {VOTING_STRATEGIES} from "../../../constants/votingStrategies"
import {AuthContext} from "../../../context/AuthContext"
import {Usul, VotingStrategy} from "../../../types/DAO"
import Select from "../../Controls/Select"
import ConnectWalletPlaceholder from "../../UI/ConnectWalletPlaceholder"
import CreateAdminProposal from "./CreateAdminProposal"
import CreateStrategyProposal from "./CreateStrategyProposal"
import "./styles.scss"

const CreateDaoProposal: FunctionComponent<{
	gnosisAddress: string
	usuls: Usul[]
	gnosisVotingThreshold: number
	ownersCount: number
	isAdmin: boolean
}> = ({gnosisAddress, usuls, gnosisVotingThreshold, ownersCount, isAdmin}) => {
	const {connected} = useContext(AuthContext)
	const [selectedModuleIndex, setSelectedModuleIndex] = useState(isAdmin ? -1 : 0)
	const [selectedStrategy, setSelectedStrategy] = useState<VotingStrategy | null>(null)

	const handleModuleSelect = (value: number) => {
		setSelectedModuleIndex(value)
		setSelectedStrategy(null)
	}

	const handleStrategySelect = (value: string) => {
		if (value === null || !usuls[selectedModuleIndex]) {
			setSelectedStrategy(null)
		}
		const strategy = usuls[selectedModuleIndex].strategies.find(s => s.address === value)
		if (!strategy) {
			throw new Error("Unexpected strategy")
		}
		setSelectedStrategy(strategy)
	}

	if (!connected) return <ConnectWalletPlaceholder />

	return (
		<div className="create-dao-proposal">
			<h2>Create a New Proposal</h2>
			<label htmlFor="create-proposal-module">Proposal module</label>
			<Select
				id="create-proposal-module"
				fullWidth
				onChange={handleModuleSelect}
				placeholder="Choose One"
				options={[
					{
						name: "Safe Admins",
						value: -1
					}
				].concat(
					usuls.map((usul, index) => ({
						name: `${usul.usulAddress} (${
							usul.deployType === "usulMulti"
								? networks[config.SIDE_CHAIN_ID]
								: networks[config.CHAIN_ID]
						})`,
						value: index
					}))
				)}
				value={selectedModuleIndex}
			/>
			{selectedModuleIndex !== -1 && usuls[selectedModuleIndex] && (
				<>
					<label htmlFor="create-proposal-strategy">Voting Strategy</label>
					<Select
						id="create-proposal-strategy"
						fullWidth
						onChange={handleStrategySelect}
						placeholder="Choose One"
						options={usuls[selectedModuleIndex].strategies.map(strategy => ({
							name:
								VOTING_STRATEGIES.find(s => s.strategy === strategy.name)?.title ?? strategy.name,
							value: strategy.address
						}))}
						value={selectedStrategy?.address ?? null}
					/>
				</>
			)}
			{selectedModuleIndex === -1 && (
				<CreateAdminProposal
					gnosisAddress={gnosisAddress}
					gnosisVotingThreshold={gnosisVotingThreshold}
					ownersCount={ownersCount}
				/>
			)}{" "}
			{selectedModuleIndex > -1 && usuls[selectedModuleIndex] && selectedStrategy && (
				<CreateStrategyProposal
					gnosisAddress={gnosisAddress}
					usulAddress={usuls[selectedModuleIndex].usulAddress}
					strategyAddress={selectedStrategy.address}
					strategyType={selectedStrategy.name}
					usulDeployType={usuls[selectedModuleIndex].deployType}
					bridgeAddress={usuls[selectedModuleIndex].bridgeAddress}
				/>
			)}
		</div>
	)
}

export default CreateDaoProposal
