import {FunctionComponent, useState} from "react"
import Paper from "../../../UI/Paper"
import Divider from "../../../UI/Divider"
import Button from "../../../Controls/Button"
import {VotingStrategy, BuiltVotingStrategy} from "../../../../types/DAO"
import VotingStrategyCard from "../../../UI/VotingStrategyCard"
import {VOTING_STRATEGIES} from "../../../../constants/votingStrategies"
import DeployVotingStrategyModal from "../../../Modals/DeployVotingStrategyModal"
import ConfirmationModal from "../../../Modals/ConfirmationModal"
import {ReactComponent as StepDotDoneIcon} from "../../../../assets/icons/step-dot-done.svg"
import "./styles.scss"
import {SafeTransaction} from "../../../../api/ethers/functions/gnosisSafe/safeUtils"

const ChooseVotingStrategies: FunctionComponent<{
	gnosisAddress: string
	strategies: BuiltVotingStrategy[]
	transactions: {tx: SafeTransaction; name: string}[]
	onStrategyAdd: (strategy: BuiltVotingStrategy) => void
	onStrategyRemove: (index: number) => void
	onSubmit: () => void
}> = ({gnosisAddress, strategies, transactions, onStrategyAdd, onStrategyRemove, onSubmit}) => {
	const [addStrategyModalOpened, setAddStrategyModalOpened] = useState<VotingStrategy | null>(null)
	const [removeStrategyModalOpened, setRemoveStrategyModalOpened] = useState<number | null>(null)

	const handleSubmitVotingStrategy = (votingStrategy: BuiltVotingStrategy) => {
		onStrategyAdd(votingStrategy)
		setAddStrategyModalOpened(null)
	}

	const handleStrategyRemove = (index: number) => {
		onStrategyRemove(index)
		setRemoveStrategyModalOpened(null)
	}

	return (
		<>
			{removeStrategyModalOpened != null && (
				<ConfirmationModal
					title="Remove strategy"
					text="Are you sure you want to remove this strategy?"
					onSubmit={async () => {
						handleStrategyRemove(removeStrategyModalOpened)
					}}
					submitText="Confirm"
					isOpened
					handleClose={() => {
						setRemoveStrategyModalOpened(null)
					}}
				/>
			)}
			{addStrategyModalOpened && (
				<DeployVotingStrategyModal
					gnosisAddress={gnosisAddress}
					strategy={addStrategyModalOpened}
					onClose={() => setAddStrategyModalOpened(null)}
					onSubmit={handleSubmitVotingStrategy}
				/>
			)}
			<Paper className="voting-strategies">
				<div className="voting-strategies__strategies">
					<h2>Selected Strategies</h2>
					<div className="voting-strategies__row">
						{strategies.map((strategy, index) => {
							const strategyContent = VOTING_STRATEGIES.find(s => s.strategy === strategy.strategy)
							if (!strategyContent) {
								throw new Error("Unexpected strategy")
							}
							return (
								<VotingStrategyCard
									key={index}
									title={strategyContent.title}
									description={strategyContent.description}
									image={strategyContent.cardImage}
									onClick={() => {
										setRemoveStrategyModalOpened(index)
									}}
								/>
							)
						})}
					</div>
					<Divider />
					<h2>All Strategies</h2>
					<div className="voting-strategies__row">
						{VOTING_STRATEGIES.map(strategy => (
							<VotingStrategyCard
								key={strategy.strategy}
								title={strategy.title}
								description={strategy.description}
								image={strategy.cardImage}
								onClick={() => {
									setAddStrategyModalOpened(strategy.strategy)
								}}
							/>
						))}
					</div>
				</div>
				<Divider type="vertical" />
				<div className="voting-strategies__transactions">
					<h2>Bundle Transactions</h2>
					{transactions.map((tx, index) => (
						<div key={index} className="voting-strategies__transaction">
							<div className="voting-strategies__transaction-icon">
								<StepDotDoneIcon width="20px" height="20px" />
							</div>
							<span>{tx.name}</span>
						</div>
					))}
					<Button disabled={strategies.length === 0} onClick={onSubmit}>
						Continue
					</Button>
				</div>
			</Paper>
		</>
	)
}

export default ChooseVotingStrategies
