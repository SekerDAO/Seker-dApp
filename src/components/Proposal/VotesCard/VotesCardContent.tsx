import {FunctionComponent} from "react"
import ProgressBar from "../../UI/ProgressBar"
import {formatReadableAddress, capitalize} from "../../../utlls"

export type VotesCardContentProps = {
	type: "for" | "against" | "abstain"
	percentageValue: number
	tokensValue: number
	votes: {address: string; tokens: number}[]
}
const VotesCardContent: FunctionComponent<VotesCardContentProps> = ({
	children,
	type,
	percentageValue,
	tokensValue,
	votes
}) => {
	return (
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
					{votes.map(({address, tokens}) => (
						<li key={address}>
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
}

export default VotesCardContent
