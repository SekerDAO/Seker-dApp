import React, {FunctionComponent, useContext, useState} from "react"
import {useParams} from "react-router-dom"
import HorizontalMenu from "../../components/HorizontalMenu"
import "./styles.scss"
import MembersIcon from "../../icons/MembersIcon"
import HouseIcon from "../../icons/HouseIcon"
import ShieldIcon from "../../icons/ShieldIcon"
import useDAO from "../../customHooks/useDAO"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Loader from "../../components/Loader"
import {AuthContext} from "../../context/AuthContext"
import Button from "../../components/Controls/Button"

const menuEntries = ["About", "Members", "Proposals", "Create Proposal", "Collection"]

const DAOPage: FunctionComponent = () => {
	const {account, connected} = useContext(AuthContext)
	const {id} = useParams<{id: string}>()
	const [activeMenuIndex, setActiveMenuIndex] = useState(0)
	const {DAO, loading, error} = useDAO(id)

	if (error) return <ErrorPlaceholder />
	if (!DAO || loading) return <Loader />

	const isOwner = connected && !!DAO.members.find(m => m.address === account)

	return (
		<div className="dao">
			<div className="dao__left-section">
				<div className="dao__photo" />
				<div className="dao__info">
					<h2>{DAO.name}</h2>
					<p>TODO: est.</p>
					<p>TODO: website</p>
					{isOwner ? (
						<Button buttonType="primary">Edit House Profile</Button>
					) : (
						<>
							<Button buttonType="primary">Join House</Button>
							<Button buttonType="secondary">Apply For Commission</Button>
						</>
					)}
				</div>
			</div>
			<div className="dao__main">
				<HorizontalMenu
					entries={menuEntries}
					activeIndex={activeMenuIndex}
					onChange={index => {
						setActiveMenuIndex(index)
					}}
				/>
				{activeMenuIndex === 0 && (
					<>
						<div className="dao__summary">
							<div className="dao__summary-item">
								<p>Active Members</p>
								<MembersIcon />
								<h2>{DAO.members.length}</h2>
							</div>
							<div className="dao__summary-item">
								<p>House Bank</p>
								<HouseIcon />
								<h2>TODO</h2>
							</div>
							<div className="dao__summary-item">
								<p>Funded Projects</p>
								<ShieldIcon />
								<h2>TODO</h2>
							</div>
						</div>
						<h2>About {DAO.name}</h2>
						<div className="dao__separator" />
						<p>TODO: description</p>
						<h2>DAO Parameters</h2>
						<div className="dao__params">
							<div className="dao__param">
								<h2>TODO</h2>
								<p>
									ERC-20
									<br />
									Token
								</p>
							</div>
							<div className="dao__param">
								<h2>{DAO.minContribution}</h2>
								<p>
									Minimum
									<br />
									Contribution
								</p>
							</div>
							<div className="dao__param">
								<h2>{DAO.govTokensAwarded}</h2>
								<p>
									Governance
									<br />
									Token Awarded
								</p>
							</div>
							<div className="dao__param">
								<h2>{DAO.minProposalAmount}</h2>
								<p>
									Minimum
									<br />
									Proposal Amount
								</p>
							</div>
							<div className="dao__param">
								<h2>{DAO.decisionMakingSpeed}</h2>
								<p>
									Decision
									<br />
									Making Speed
								</p>
							</div>
							<div className="dao__param">
								<h2>{DAO.votingThreshold}</h2>
								<p>
									Voting
									<br />
									Threshold
								</p>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}

export default DAOPage
