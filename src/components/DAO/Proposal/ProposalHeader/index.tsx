import {FunctionComponent, useEffect, useState} from "react"
import {Link} from "react-router-dom"
import config from "../../../../config"
import networks from "../../../../constants/networks"
import {isSafeProposal, SafeProposal} from "../../../../types/safeProposal"
import {StrategyProposal} from "../../../../types/strategyProposal"
import {capitalize, formatReadableAddress, formatTime} from "../../../../utlls"
import Tag from "../../../UI/Tag"
import "./styles.scss"

const ProposalHeader: FunctionComponent<{
	proposal: SafeProposal | StrategyProposal
	id: string
	showLinks?: boolean
	sideChain: boolean
	refetch?: () => void
}> = ({proposal, id, children, showLinks, sideChain, refetch}) => {
	const isAdminProposal = isSafeProposal(proposal)
	const [currentDate, setCurrentDate] = useState(new Date().getTime())
	const updateDate = () => {
		setCurrentDate(new Date().getTime())
		if (!isAdminProposal && refetch && proposal.deadline! * 1000 < new Date().getTime() - 5000) {
			refetch()
		}
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
						? `${timeDiff.minutes > 0 ? ", " : ""}${Math.max(0, timeDiff.seconds)} Seconds`
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
				<span>{isAdminProposal ? "Admin Voting" : proposal.strategyType}</span>
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
					{!isAdminProposal && proposal.govTokenAddress && (
						<p>
							Voting Token:
							<a
								href={
									sideChain
										? `https://blockscout.com/${
												config.SIDE_CHAIN_ID === 77 ? "poa/sokol" : "xdai/aox"
										  }/token/${proposal.govTokenAddress}`
										: `https://${
												config.CHAIN_ID === 1 ? "" : `${networks[config.CHAIN_ID]}.`
										  }etherscan.io/token/${proposal.govTokenAddress}`
								}
								target="_blank"
								rel="noopener noreferrer"
							>
								{formatReadableAddress(proposal.govTokenAddress)}
							</a>
						</p>
					)}
				</div>
			)}
		</div>
	)
}

export default ProposalHeader
