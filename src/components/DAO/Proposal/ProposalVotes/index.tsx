import {FunctionComponent, useState} from "react"
import {capitalize, formatReadableAddress} from "../../../../utlls"
import Button from "../../../Controls/Button"
import Modal from "../../../Modals/Modal"
import Paper from "../../../UI/Paper"
import ProgressBar from "../../../UI/ProgressBar"
import "./styles.scss"

type VotesCardProps = {
	type: "for" | "against" | "abstain"
	percentageValue: number
	tokensValue: number
	votes: {address: string; tokens: number}[]
}
const VotesCard: FunctionComponent<VotesCardProps> = ({
	children,
	type,
	percentageValue,
	tokensValue,
	votes
}) => (
	<>
		<div className="votes-card__header">
			<h2>
				<span>{capitalize(type)}</span>
				<span>{percentageValue}%</span>
			</h2>
			<ProgressBar
				color={type === "for" ? "green" : type === "against" ? "red" : "grey"}
				value={percentageValue}
			/>
			<span className="votes-card__tokens-value">{(tokensValue / 1000).toFixed(2)}k</span>
		</div>
		<div className="votes-card__body">
			<h3>
				<span>Addresses</span>
				<span>Votes</span>
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
						<span>{(tokens / 1000).toFixed(2)}k</span>
					</li>
				))}
			</ul>
			{children}
		</div>
	</>
)

const ProposalVotes: FunctionComponent<VotesCardProps> = ({
	type,
	percentageValue,
	tokensValue,
	votes
}) => {
	const [showModal, setShowModal] = useState(false)
	return (
		<Paper className="votes-card">
			<VotesCard
				votes={votes.slice(0, 3)}
				type={type}
				percentageValue={percentageValue}
				tokensValue={tokensValue}
			>
				<Button buttonType="link" onClick={() => setShowModal(true)}>
					View More
				</Button>
			</VotesCard>
			<Modal show={showModal} onClose={() => setShowModal(false)}>
				<VotesCard
					votes={votes}
					type={type}
					percentageValue={percentageValue}
					tokensValue={tokensValue}
				/>
			</Modal>
		</Paper>
	)
}

export default ProposalVotes
