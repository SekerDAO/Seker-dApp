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
	const [selectedModuleIndex, setSelectedModuleIndex] = useState(-1)
	const [selectedStrategy, setSelectedStrategy] = useState<VotingStrategy | null>(null)

	const handleModuleSelect = (value: number) => {
		setSelectedModuleIndex(value)
		setSelectedStrategy(null)
	}

	const handleStrategySelect = (value: string) => {
		if (value === null) {
			setSelectedStrategy(null)
		}
		const strategy = dao.usuls[selectedModuleIndex].strategies.find(s => s.address === value)
		if (!strategy) {
			throw new Error("Unexpected strategy")
		}
		setSelectedStrategy(strategy)
	}

	return (
		<div className="dao-members">
			<div className="dao-members__header">
				<h1>Members</h1>
				<div className="dao-members__header-strategy-selector">
					<label htmlFor="members-module">Module</label>
					<Select
						id="members-module"
						fullWidth
						onChange={handleModuleSelect}
						placeholder="Choose One"
						options={[
							{
								name: "Safe Admins",
								value: -1
							}
						].concat(
							dao.usuls.map((usul, index) => ({
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
				</div>
				{selectedModuleIndex !== -1 && (
					<div className="dao-members__header-strategy-selector">
						<label htmlFor="members-strategy">Voting Strategy</label>
						<Select
							id="members-strategy"
							fullWidth
							onChange={handleStrategySelect}
							placeholder="Choose One"
							options={dao.usuls[selectedModuleIndex].strategies.map(strategy => ({
								name:
									VOTING_STRATEGIES.find(s => s.strategy === strategy.name)?.title ?? strategy.name,
								value: strategy.address
							}))}
							value={selectedStrategy?.address ?? null}
						/>
					</div>
				)}
			</div>
			<div className="dao-members__body">
				{selectedModuleIndex === -1 ? (
					<>
						<h2>Safe Admins</h2>
						<Table
							columns={columns}
							idCol="address"
							data={dao.owners.map(owner => ({
								address: formatReadableAddress(owner)
							}))}
						/>
					</>
				) : selectedStrategy ? (
					<>
						{delegateModalOpen &&
							selectedModuleIndex !== -1 &&
							selectedStrategy?.govTokenAddress && (
								<DelegateTokenModal
									onClose={() => setDelegateModalOpen(false)}
									strategy={selectedStrategy}
									sideChain={dao.usuls[selectedModuleIndex].deployType === "usulMulti"}
								/>
							)}
						<h2>Voting Token</h2>
						{selectedModuleIndex !== -1 && selectedStrategy?.govTokenAddress && (
							<>
								<div className="dao-members__body-heading">
									<div className="dao-members__body-heading-left">
										<p>
											Voting Token:
											<Button
												buttonType="link"
												onClick={() =>
													window.open(
														dao.usuls[selectedModuleIndex].deployType === "usulMulti"
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
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={
												dao.usuls[selectedModuleIndex].deployType === "usulMulti"
													? `https://blockscout.com/${
															config.SIDE_CHAIN_ID === 77 ? "poa/sokol" : "xdai/aox"
													  }/token/${selectedStrategy.govTokenAddress}`
													: `https://${
															config.CHAIN_ID === 1 ? "" : `${networks[config.CHAIN_ID]}.`
													  }etherscan.io/token/${selectedStrategy.govTokenAddress}#balances`
											}
										>
											View token holders on Etherscan
										</a>
									</div>
									<div className="dao-members__body-heading-right">
										<Button onClick={() => setDelegateModalOpen(true)}>Delegate Vote</Button>
									</div>
								</div>
								{VOTING_STRATEGIES.find(s => s.strategy === selectedStrategy?.name)
									?.withMembers && (
									<>
										<h2>Strategy Members</h2>
										<Table
											columns={columns}
											idCol="address"
											data={selectedStrategy.members!.map(member => ({
												address: formatReadableAddress(member)
											}))}
										/>
									</>
								)}
							</>
						)}
					</>
				) : null}
			</div>
		</div>
	)
}

export default DAOMembers
