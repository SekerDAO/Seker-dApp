import {BigNumber} from "@ethersproject/bignumber"
import {FunctionComponent, useState} from "react"
import {StrategyProposalVote} from "../../../../types/strategyProposal"
import {capitalize, formatNumber, formatReadableAddress} from "../../../../utlls"
import Button from "../../../Controls/Button"
import Modal from "../../../Modals/Modal"
import Paper from "../../../UI/Paper"
import ProgressBar from "../../../UI/ProgressBar"
import "./styles.scss"

type StrategyVotesCardProps = {
	type: "for" | "against" | "abstain"
	totalValue: BigNumber
	value: BigNumber
	votes: StrategyProposalVote[]
}

const StrategyVotesCard: FunctionComponent<StrategyVotesCardProps> = ({
	children,
	type,
	value,
	totalValue,
	votes
}) => {
	const percentageValue = totalValue.isZero()
		? 0
		: Math.round(value.div(totalValue).toNumber() * 100)

	return (
		<>
			<div className="votes-card__header">
				<h2>
					<span>{capitalize(type)}</span>
					<span>{`${percentageValue}%`}</span>
				</h2>
				<ProgressBar
					color={type === "for" ? "green" : type === "against" ? "red" : "grey"}
					value={percentageValue}
				/>
				<span className="votes-card__value">
					{formatNumber(value.div(Math.pow(10, 15)).toNumber())}
				</span>
			</div>
			<div className="votes-card__body">
				<h3>
					<span>Addresses</span>
					<span>Votes</span>
				</h3>
				<ul>
					{votes.map(({voter, weight}, index) => (
						<li key={index}>
							<a
								href={`https://rinkeby.etherscan.io/address/${voter}`}
								target="_blank"
								rel="noreferrer"
							>
								{formatReadableAddress(voter)}
							</a>
							<span>{`${weight.div(1000).toString()}k`}</span>
						</li>
					))}
				</ul>
				{children}
			</div>
		</>
	)
}

const StrategyProposalVotes: FunctionComponent<StrategyVotesCardProps & {fullWidth?: boolean}> = ({
	type,
	value,
	totalValue,
	votes,
	fullWidth
}) => {
	const [showModal, setShowModal] = useState(false)
	return (
		<Paper className={`votes-card${fullWidth ? " votes-card--full-width" : ""}`}>
			<StrategyVotesCard
				votes={votes.slice(0, 3)}
				type={type}
				value={value}
				totalValue={totalValue}
			>
				{votes.length > 3 && (
					<Button buttonType="link" onClick={() => setShowModal(true)}>
						View More
					</Button>
				)}
			</StrategyVotesCard>
			{votes.length > 3 && (
				<Modal show={showModal} onClose={() => setShowModal(false)}>
					<StrategyVotesCard votes={votes} type={type} value={value} totalValue={totalValue} />
				</Modal>
			)}
		</Paper>
	)
}

export default StrategyProposalVotes
