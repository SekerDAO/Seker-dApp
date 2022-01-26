import {FunctionComponent, useState} from "react"
import config from "../../../config"
import networks from "../../../constants/networks"
import {VOTING_STRATEGIES} from "../../../constants/votingStrategies"
import {DAO, VotingStrategy} from "../../../types/DAO"
import {formatReadableAddress} from "../../../utlls"
import Button from "../../Controls/Button"
import Select from "../../Controls/Select"
import DelegateTokenModal from "../../Modals/DelegateTokenModal"
import Table from "../../UI/Table"
import "./styles.scss"

const columns = [{id: "address" as const, name: "Address"}]

const DAOMembers: FunctionComponent<{
	dao: DAO
}> = ({dao}) => {
	const [delegateModalOpen, setDelegateModalOpen] = useState(false)
	const [selectedStrategy, setSelectedStrategy] = useState<VotingStrategy | "admin">("admin")

	const handleStrategySelect = (value: string) => {
		if (value === "admin") {
			setSelectedStrategy("admin")
		} else {
			const strategy = dao.strategies.find(s => s.address === value)
			if (!strategy) {
				throw new Error("Unexpected strategy")
			}
			setSelectedStrategy(strategy)
		}
	}

	return (
		<div className="dao-members">
			<div className="dao-members__header">
				<h1>Members</h1>
				<div className="dao-members__header-strategy-selector">
					<label>Voting Strategy</label>
					<Select
						fullWidth
						onChange={handleStrategySelect}
						placeholder="Choose One"
						options={[
							{
								name: "Safe Admins",
								value: "admin"
							}
						].concat(
							dao.strategies.map(strategy => ({
								name:
									VOTING_STRATEGIES.find(s => s.strategy === strategy.name)?.title ?? strategy.name,
								value: strategy.address
							}))
						)}
						value={selectedStrategy === "admin" ? "admin" : selectedStrategy.address}
					/>
				</div>
			</div>
			<div className="dao-members__body">
				{delegateModalOpen &&
					selectedStrategy !== "admin" &&
					selectedStrategy.name === "linearVoting" && (
						<DelegateTokenModal
							onClose={() => setDelegateModalOpen(false)}
							strategy={selectedStrategy}
							sideChain={dao.usulDeployType === "usulMulti"}
						/>
					)}
				<div className="dao-members__body-heading">
					<div className="dao-members__body-heading-left">
						<h2>
							{selectedStrategy === "admin"
								? "Safe Admins"
								: VOTING_STRATEGIES.find(s => s.strategy === selectedStrategy.name)?.title ??
								  selectedStrategy.name}
						</h2>
						{selectedStrategy !== "admin" && (
							<p>
								Voting Token:
								<Button
									buttonType="link"
									onClick={() =>
										window.open(
											dao.usulDeployType === "usulMulti"
												? `https://blockscout.com/${
														config.SIDE_CHAIN_ID === 77 ? "poa/sokol" : "xdai/aox"
												  }/address/${selectedStrategy.govTokenAddress}/transactions`
												: `https://${
														config.CHAIN_ID === 1 ? "" : `${networks[config.CHAIN_ID]}.`
												  }etherscan.io/address/${selectedStrategy.govTokenAddress}`,
											"_blank",
											"noopener,noreferrer"
										)
									}
								>
									[{formatReadableAddress(selectedStrategy.address)}]
								</Button>
							</p>
						)}
					</div>
					<div className="dao-members__body-heading-right">
						{selectedStrategy !== "admin" && selectedStrategy.name === "linearVoting" && (
							<Button onClick={() => setDelegateModalOpen(true)}>Delegate Vote</Button>
						)}
					</div>
				</div>
				{selectedStrategy === "admin" ? (
					<Table
						columns={columns}
						idCol="address"
						data={dao.owners.map(owner => ({
							address: formatReadableAddress(owner)
						}))}
					/>
				) : selectedStrategy.govTokenAddress ? (
					<>
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={
								dao.usulDeployType === "usulMulti"
									? `https://blockscout.com/${
											config.SIDE_CHAIN_ID === 77 ? "poa/sokol" : "xdai/aox"
									  }/token/${selectedStrategy.govTokenAddress}`
									: `https://${
											config.CHAIN_ID === 1 ? "" : `${networks[config.CHAIN_ID]}.`
									  }etherscan.io/token/${selectedStrategy.govTokenAddress}#balances`
							}
						>
							View holders on Etherscan
						</a>
					</>
				) : (
					<div>TODO: non-token strategy members</div>
				)}
			</div>
		</div>
	)
}

export default DAOMembers
