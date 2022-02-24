import {FunctionComponent, useState, useContext} from "react"
import getOZLinearDeployTx from "../../../../api/ethers/functions/Usul/voting/OzLinearVoting/getOZLinearDeployTx"
import {ReactComponent as DeleteIcon} from "../../../../assets/icons/delete.svg"
import {ReactComponent as StepDotDoneIcon} from "../../../../assets/icons/step-dot-done.svg"
import config from "../../../../config"
import {VOTING_STRATEGIES} from "../../../../constants/votingStrategies"
import {AuthContext} from "../../../../context/AuthContext"
import useCheckNetwork from "../../../../hooks/useCheckNetwork"
import {VotingStrategyName, BuiltVotingStrategy, UsulDeployType} from "../../../../types/DAO"
import Button from "../../../Controls/Button"
import DeployVotingStrategyModal, {
	VotingStrategyFormValues
} from "../../../Modals/DeployVotingStrategyModal"
import Divider from "../../../UI/Divider"
import Paper from "../../../UI/Paper"
import VotingStrategyCard from "../../../UI/VotingStrategyCard"
import "./styles.scss"

const ChooseVotingStrategies: FunctionComponent<{
	gnosisAddress: string
	strategies: BuiltVotingStrategy[]
	onStrategyAdd: (strategy: BuiltVotingStrategy) => void
	onStrategyRemove: (index: number) => void
	onSubmit: () => void
	deployType: UsulDeployType
}> = ({gnosisAddress, strategies, onStrategyAdd, onStrategyRemove, onSubmit, deployType}) => {
	const {signer} = useContext(AuthContext)
	const [addStrategyModalOpened, setAddStrategyModalOpened] = useState<VotingStrategyName | null>(
		null
	)

	const checkedGetOzLinearDeployTx = useCheckNetwork(
		getOZLinearDeployTx,
		deployType === "usulSingle" ? config.CHAIN_ID : config.SIDE_CHAIN_ID
	)

	const handleSubmitVotingStrategy = async (
		strategy: VotingStrategyName,
		{tokenAddress, quorumThreshold, delay, votingPeriod}: VotingStrategyFormValues
	) => {
		if (strategy === "linearVoting") {
			if (
				delay &&
				!isNaN(delay) &&
				delay >= 0 &&
				quorumThreshold &&
				!isNaN(quorumThreshold) &&
				quorumThreshold >= 2 &&
				votingPeriod &&
				!isNaN(votingPeriod) &&
				votingPeriod >= 2 &&
				signer
			) {
				const {tx, expectedAddress} = await checkedGetOzLinearDeployTx(
					gnosisAddress,
					tokenAddress,
					quorumThreshold,
					delay,
					votingPeriod,
					signer,
					deployType === "usulMulti"
				)
				onStrategyAdd({strategy, tx, expectedAddress})
				setAddStrategyModalOpened(null)
			}
		} else {
			throw new Error("Voting Strategy is not supported yet")
		}
	}

	const handleStrategyRemove = (index: number) => {
		onStrategyRemove(index)
	}

	return (
		<>
			{addStrategyModalOpened && (
				<DeployVotingStrategyModal
					strategy={addStrategyModalOpened}
					onClose={() => setAddStrategyModalOpened(null)}
					onSubmit={handleSubmitVotingStrategy}
					sideChain={deployType === "usulMulti"}
				/>
			)}
			<Paper className="voting-strategies">
				<div className="voting-strategies__strategies">
					<h3>Voting Strategies</h3>
					<div className="voting-strategies__row">
						{VOTING_STRATEGIES.map(({strategy, title, description, cardImage, active}) => (
							<VotingStrategyCard
								key={strategy}
								title={title}
								description={description}
								image={cardImage}
								isActive={active}
								onClick={() => setAddStrategyModalOpened(strategy)}
							/>
						))}
					</div>
				</div>
				<Divider type="vertical" />
				<div className="voting-strategies__deployments">
					<h3>Bundle Deployments</h3>
					{strategies.map((strategy, index) => {
						const strategyContent = VOTING_STRATEGIES.find(
							votingStrategy => votingStrategy.strategy === strategy.strategy
						)
						return (
							<div key={index} className="voting-strategies__deployment">
								<div
									className="voting-strategies__deployment-icon"
									onClick={() => handleStrategyRemove(index)}
								>
									<StepDotDoneIcon width="20px" height="20px" />
									<DeleteIcon width="20px" height="20px" className="deployment__delete-icon" />
								</div>
								<span>{strategyContent?.title}</span>
							</div>
						)
					})}
					<Button disabled={strategies.length === 0} onClick={onSubmit}>
						Continue
					</Button>
				</div>
			</Paper>
		</>
	)
}

export default ChooseVotingStrategies
