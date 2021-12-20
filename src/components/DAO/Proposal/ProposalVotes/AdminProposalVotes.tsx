import {FunctionComponent, useState} from "react"
import {formatReadableAddress} from "../../../../utlls"
import Button from "../../../Controls/Button"
import Modal from "../../../Modals/Modal"
import Paper from "../../../UI/Paper"
import ProgressBar from "../../../UI/ProgressBar"
import "./styles.scss"

type AdminVotesCardProps = {
	totalValue: number
	value: number
	votes: {address: string; tokens: number}[]
}

const AdminVotesCard: FunctionComponent<AdminVotesCardProps> = ({
	children,
	value,
	totalValue,
	votes
}) => {
	const percentageValue = (value / totalValue) * 100

	return (
		<>
			<div className="votes-card__header">
				<h2>
					<span>Confirmed</span>
					<span>{value}</span>
				</h2>
				<ProgressBar color="green" value={percentageValue} />
				<span className="votes-card__value">
					{`Confirmations Needed to Pass: ${totalValue - value}`}
				</span>
			</div>
			<div className="votes-card__body">
				<h3>
					<span>Addresses</span>
					<span>Confirmations</span>
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
							<span>{tokens}</span>
						</li>
					))}
				</ul>
				{children}
			</div>
		</>
	)
}

const AdminProposalVotes: FunctionComponent<AdminVotesCardProps & {fullWidth?: boolean}> = ({
	value,
	totalValue,
	votes,
	fullWidth
}) => {
	const [showModal, setShowModal] = useState(false)
	return (
		<Paper className={`votes-card${fullWidth ? " votes-card--full-width" : ""}`}>
			<AdminVotesCard votes={votes.slice(0, 3)} value={value} totalValue={totalValue}>
				{votes.length > 3 && (
					<Button buttonType="link" onClick={() => setShowModal(true)}>
						View More
					</Button>
				)}
			</AdminVotesCard>
			{votes.length > 3 && (
				<Modal show={showModal} onClose={() => setShowModal(false)}>
					<AdminVotesCard votes={votes} value={value} totalValue={totalValue} />
				</Modal>
			)}
		</Paper>
	)
}

export default AdminProposalVotes
