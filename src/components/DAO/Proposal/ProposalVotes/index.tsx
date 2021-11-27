import {FunctionComponent, useState} from "react"
import {VotingStrategy} from "../../../../types/DAO"
import {capitalize, formatReadableAddress} from "../../../../utlls"
import Button from "../../../Controls/Button"
import Modal from "../../../Modals/Modal"
import Paper from "../../../UI/Paper"
import ProgressBar from "../../../UI/ProgressBar"
import "./styles.scss"

type VotesCardProps = {
	votingStrategy: "admin" | VotingStrategy
	type: "for" | "against" | "abstain"
	totalValue: number
	value: number
	votes: {address: string; tokens: number}[]
}
const VotesCard: FunctionComponent<VotesCardProps> = ({
	children,
	type,
	value,
	totalValue,
	votes,
	votingStrategy
}) => {
	const isAdminProposal = votingStrategy === "admin"
	const percentageValue = (value / totalValue) * 100
	const formatNumber = (num: number) => `${(num / 1000).toFixed(2)}k`
	return (
		<>
			<div className="votes-card__header">
				<h2>
					<span>{isAdminProposal ? "Confirmed" : capitalize(type)}</span>
					<span>{isAdminProposal ? value : `${percentageValue}%`}</span>
				</h2>
				<ProgressBar
					color={type === "for" ? "green" : type === "against" ? "red" : "grey"}
					value={percentageValue}
				/>
				<span className="votes-card__value">
					{isAdminProposal
						? `Confirmations Needed to Pass: ${totalValue - value}`
						: formatNumber(value)}
				</span>
			</div>
			<div className="votes-card__body">
				<h3>
					<span>Addresses</span>
					<span>{isAdminProposal ? "Confirmations" : "Votes"}</span>
				</h3>
				<ul>
					{votes.map(({address, tokens}, index) => (
						<li key={index}>
							<a
								href={`https://rinkeby.etherscan.io/address/${address}`}
								target="_blank"
								rel="noreferrer"
							>
								{formatReadableAddress(address)}
							</a>
							<span>{isAdminProposal ? tokens : formatNumber(tokens)}</span>
						</li>
					))}
				</ul>
				{children}
			</div>
		</>
	)
}

const ProposalVotes: FunctionComponent<VotesCardProps & {fullWidth?: boolean}> = ({
	type,
	value,
	totalValue,
	votes,
	fullWidth,
	votingStrategy
}) => {
	const [showModal, setShowModal] = useState(false)
	return (
		<Paper className={`votes-card${fullWidth ? " votes-card--full-width" : ""}`}>
			<VotesCard
				votes={votes.slice(0, 3)}
				type={type}
				value={value}
				totalValue={totalValue}
				votingStrategy={votingStrategy}
			>
				{votes.length > 3 && (
					<Button buttonType="link" onClick={() => setShowModal(true)}>
						View More
					</Button>
				)}
			</VotesCard>
			{votes.length > 3 && (
				<Modal show={showModal} onClose={() => setShowModal(false)}>
					<VotesCard
						votes={votes}
						type={type}
						value={value}
						totalValue={totalValue}
						votingStrategy={votingStrategy}
					/>
				</Modal>
			)}
		</Paper>
	)
}

export default ProposalVotes
