import {FunctionComponent, useState} from "react"
import {VOTING_STRATEGIES} from "../../../constants/votingStrategies"
import {DAO} from "../../../types/DAO"
import {formatReadableAddress} from "../../../utlls"
import Button from "../../Controls/Button"
import Select from "../../Controls/Select"
import DelegateTokenModal from "../../Modals/DelegateTokenModal"
import Table from "../../UI/Table"
import "./styles.scss"

const columns = [
	{id: "address" as const, name: "Addresses"},
	{id: "proposalsVoted" as const, name: "Proposals Voted"},
	{id: "totalVotes" as const, name: "Total Votes"},
	{id: "votingWeight" as const, name: "Voting Weight"}
]

// TODO: Get members data from strategy
const DAOMembers: FunctionComponent<{
	dao: DAO
}> = ({dao}) => {
	const [delegateModalOpen, setDelegateModalOpen] = useState(false)
	const [selectedStrategyAddress, setSelectedStrategyAddress] = useState<string>()
	const selectedStrategy = dao.strategies.find(
		strategy => strategy.address === selectedStrategyAddress
	)
	const findVotingStrategyContent = (strategyName?: string) =>
		VOTING_STRATEGIES.find(strategy => strategy.strategy === strategyName)
	const selectedVotingStrategyContent = findVotingStrategyContent(selectedStrategy?.name)
	return (
		<div className="dao-members">
			<div className="dao-members__header">
				<h1>Members</h1>
				<div className="dao-members__header-strategy-selector">
					<label>Voting Strategy</label>
					<Select
						fullWidth
						onChange={newValue => setSelectedStrategyAddress(newValue)}
						placeholder="Choose One"
						options={dao.strategies.map(strategy => ({
							name: findVotingStrategyContent(strategy.name)?.title as string,
							value: strategy.address
						}))}
						value={selectedStrategyAddress}
					/>
				</div>
			</div>
			{selectedStrategy && (
				<div className="dao-members__body">
					{delegateModalOpen && selectedStrategy.name === "linearVoting" && (
						<DelegateTokenModal
							onClose={() => setDelegateModalOpen(false)}
							strategy={selectedStrategy}
						/>
					)}
					<div className="dao-members__body-heading">
						<div className="dao-members__body-heading-left">
							<h2>{selectedVotingStrategyContent?.title}</h2>
							<p>
								Voting Token:
								<Button
									buttonType="link"
									onClick={() => console.log("TODO: Get token address and navigate to etherscan")}
								>
									[{formatReadableAddress(selectedStrategy.address)}]
								</Button>
							</p>
						</div>
						<div className="dao-members__body-heading-right">
							<Button onClick={() => setDelegateModalOpen(true)}>Delegate Vote</Button>
						</div>
					</div>
					<Table
						columns={columns}
						idCol="address"
						data={dao.owners.map(owner => ({
							address: formatReadableAddress(owner),
							proposalsVoted: "100",
							totalVotes: "1000",
							votingWeight: "1000"
						}))}
					/>
				</div>
			)}
		</div>
	)
}

export default DAOMembers
