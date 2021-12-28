import {FunctionComponent, useEffect, useState} from "react"
import {Link} from "react-router-dom"
import {isSafeProposal, SafeProposal} from "../../../../types/safeProposal"
import {StrategyProposal} from "../../../../types/strategyProposal"
import {capitalize, formatReadableAddress, formatTime} from "../../../../utlls"
import Tag from "../../../UI/Tag"
import "./styles.scss"

const ProposalHeader: FunctionComponent<{
	proposal: SafeProposal | StrategyProposal
	id: string
	showLinks?: boolean
}> = ({proposal, id, children, showLinks}) => {
	const isAdminProposal = isSafeProposal(proposal)
	const [currentDate, setCurrentDate] = useState(new Date().getTime())
	const updateDate = () => {
		setCurrentDate(new Date().getTime())
	}
	useEffect(() => {
		const interval = setInterval(updateDate, 1000)
		return () => {
			clearInterval(interval)
		}
	}, [])

	const displayTimer = () => {
		if (isAdminProposal) return null
		const timeDiff = formatTime(proposal.deadline! * 1000 - currentDate)
		return (
			<>
				<span>•</span>
				<span>{`${timeDiff.days > 0 ? `${timeDiff.days} Days, ` : ""}${
					timeDiff.days > 0 || timeDiff.hours > 0 ? `${timeDiff.hours} Hours` : ""
				}${
					timeDiff.days === 0 && timeDiff.hours === 0 && timeDiff.minutes > 0
						? `${timeDiff.minutes} Minutes`
						: ""
				}${
					timeDiff.days === 0 && timeDiff.hours === 0 && timeDiff.minutes < 10
						? `${timeDiff.minutes > 0 ? ", " : ""}${timeDiff.seconds} Seconds`
						: ""
				} Left`}</span>
			</>
		)
	}

	return (
		<div className="proposal__header">
			{children}
			<div className="proposal__header-title">
				<h1>{proposal.title}</h1>
				<span>{isAdminProposal ? "Admin Voting" : "Linear Voting"}</span>
			</div>
			<div className="proposal__header-subtitle">
				<Tag variant={proposal.state}>{capitalize(proposal.state)}</Tag>
				<span>ID [ {id} ]</span>
				{proposal.state === "active" && !isAdminProposal && displayTimer()}
			</div>
			{showLinks && (
				<div className="proposal__header-links">
					<p>
						Proposed by:
						<Link to={`/profile/${proposal.userAddress}`}>
							{formatReadableAddress(proposal.userAddress)}
						</Link>
					</p>
					{!isAdminProposal && (
						<p>
							Voting Token:
							<Link to={`https://rinkeby.etherscan.io/token/${proposal.govTokenAddress}`}>
								{formatReadableAddress(proposal.govTokenAddress)}
							</Link>
						</p>
					)}
				</div>
			)}
		</div>
	)
}

export default ProposalHeader
