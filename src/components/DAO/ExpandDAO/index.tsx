import {FunctionComponent, useContext, useState} from "react"
import {AuthContext} from "../../../context/AuthContext"
import {Usul, UsulDeployType, VotingStrategyName} from "../../../types/DAO"
import AddUsulStrategiesModal from "../../Modals/AddUsulStrategiesModal"
import DeployUsulTypeModal from "../../Modals/DeployUsulTypeModal"
import ConnectWalletPlaceholder from "../../UI/ConnectWalletPlaceholder"
import AddUsulStrategies from "./DeployUsul/AddUsulStrategies"
import DeployUsulMulti from "./DeployUsul/DeployUsulMulti"
import DeployUsulSingle from "./DeployUsul/DeployUsulSingle"
import StartExpandDao from "./StartExpandDao"
import "./styles.scss"

const ExpandDAO: FunctionComponent<{
	gnosisAddress: string
	gnosisVotingThreshold: number
	afterDeploy: () => void
	isAdmin: boolean
	usuls: Usul[]
}> = ({isAdmin, gnosisAddress, gnosisVotingThreshold, afterDeploy, usuls}) => {
	const [deployUsul, setDeployUsul] = useState<UsulDeployType | null>(null)
	const [votingModule, setVotingModule] = useState<
		{usulAddress: string; strategyAddress: string; strategyType: VotingStrategyName} | "admin"
	>("admin")
	const [deployTypeModalOpened, setDeployTypeModalOpened] = useState(false)
	const [addStrategiesModalUsul, setAddStrategiesModalUsul] = useState<Usul | null>(null)
	const [usulToAddStrategies, setUsulToAddStrategies] = useState<{
		usul: Usul
		strategyIndex: number
	} | null>(null)
	const {connected} = useContext(AuthContext)

	if (!connected) {
		return <ConnectWalletPlaceholder />
	}

	const handleSelectUsulType = (
		type: UsulDeployType,
		module:
			| {usulAddress: string; strategyAddress: string; strategyType: VotingStrategyName}
			| "admin"
	) => {
		setVotingModule(module)
		setDeployUsul(type)
		setDeployTypeModalOpened(false)
	}

	const handleClickAddStrategies = (usul: Usul) => {
		setAddStrategiesModalUsul(usul)
	}

	const handleStartAddStrategies = (usul: Usul, strategyIndex: number) => {
		setUsulToAddStrategies({usul, strategyIndex})
		setAddStrategiesModalUsul(null)
	}

	return (
		<>
			<DeployUsulTypeModal
				isOpened={deployTypeModalOpened}
				onClose={() => {
					setDeployTypeModalOpened(false)
				}}
				onSubmit={handleSelectUsulType}
				usuls={usuls}
			/>
			{addStrategiesModalUsul && (
				<AddUsulStrategiesModal
					onClose={() => {
						setAddStrategiesModalUsul(null)
					}}
					onSubmit={handleStartAddStrategies}
					usul={addStrategiesModalUsul}
				/>
			)}
			<section className="expand-dao">
				{deployUsul === "usulSingle" ? (
					<DeployUsulSingle
						gnosisAddress={gnosisAddress}
						gnosisVotingThreshold={gnosisVotingThreshold}
						afterDeploy={afterDeploy}
						isAdmin={isAdmin}
						votingModule={votingModule}
					/>
				) : deployUsul === "usulMulti" ? (
					<DeployUsulMulti
						gnosisAddress={gnosisAddress}
						gnosisVotingThreshold={gnosisVotingThreshold}
						afterDeploy={afterDeploy}
						isAdmin={isAdmin}
						votingModule={votingModule}
					/>
				) : usulToAddStrategies ? (
					<AddUsulStrategies
						gnosisAddress={gnosisAddress}
						usulSafeAddress={
							usulToAddStrategies.usul.deployType === "usulMulti"
								? usulToAddStrategies.usul.sideNetSafeAddress!
								: gnosisAddress
						}
						afterDeploy={afterDeploy}
						usulAddress={usulToAddStrategies.usul.usulAddress}
						votingStrategyAddress={
							usulToAddStrategies.usul.strategies[usulToAddStrategies.strategyIndex].address
						}
						votingStrategyName={
							usulToAddStrategies.usul.strategies[usulToAddStrategies.strategyIndex].name
						}
						sideChain={usulToAddStrategies.usul.deployType === "usulMulti"}
					/>
				) : (
					<StartExpandDao
						usuls={usuls}
						onDeployUsulClick={() => {
							setDeployTypeModalOpened(true)
						}}
						onAddStrategiesClick={handleClickAddStrategies}
					/>
				)}
			</section>
		</>
	)
}

export default ExpandDAO
