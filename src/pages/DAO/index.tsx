import React, {FunctionComponent, useContext, useState} from "react"
import {useParams} from "react-router-dom"
import HorizontalMenu from "../../components/HorizontalMenu"
import "./styles.scss"
import useDAO from "../../customHooks/getters/useDAO"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Loader from "../../components/Loader"
import {AuthContext} from "../../context/AuthContext"
import Button from "../../components/Controls/Button"
import AboutDAO from "../../components/DAO/AboutDAO"
import CreateDAOProposal from "../../components/DAO/CreateDAOProposal"
import DAOProposals from "../../components/DAO/DAOProposals"
import EditDAO from "../../components/DAO/EditDAO"

const menuEntries = ["About", "Members", "Proposals", "Create Proposal", "Collection"]

const DAOPage: FunctionComponent = () => {
	const {account, connected} = useContext(AuthContext)
	const {address} = useParams<{address: string}>()
	const [activeMenuIndex, setActiveMenuIndex] = useState(0)
	const {DAO, tokenSymbol, loading, error} = useDAO(address)
	const [editOpened, setEditOpened] = useState(false)

	if (error) return <ErrorPlaceholder />
	if (!DAO || loading) return <Loader />

	const isMember = connected && !!DAO.members.find(m => m.address === account)

	return (
		<div className="dao">
			<div className="dao__left-section">
				<div className="dao__photo" style={{backgroundImage: `url("/assets/DAODashboard_Photo.png")`}} />
				<div className="dao__info">
					<h2>{DAO.name}</h2>
					<p>TODO: est.</p>
					<p>{DAO.website}</p>
					{isMember ? (
						<Button
							buttonType="primary"
							onClick={() => {
								setEditOpened(true)
							}}
						>
							Edit House Profile
						</Button>
					) : (
						<>
							<Button buttonType="primary">Join House</Button>
							<Button buttonType="secondary">Apply for Commission</Button>
						</>
					)}
				</div>
			</div>
			<div className="dao__main">
				{editOpened ? (
					<EditDAO
						dao={DAO}
						onClose={() => {
							setEditOpened(false)
						}}
					/>
				) : (
					<>
						<HorizontalMenu
							entries={menuEntries}
							activeIndex={activeMenuIndex}
							onChange={index => {
								setActiveMenuIndex(index)
							}}
						/>
						{activeMenuIndex === 0 && <AboutDAO dao={DAO} tokenSymbol={tokenSymbol} />}
						{activeMenuIndex === 2 && <DAOProposals daoAddress={DAO.address} isMember={isMember} />}
						{activeMenuIndex === 3 && <CreateDAOProposal isMember={isMember} daoAddress={DAO.address} />}
					</>
				)}
			</div>
		</div>
	)
}

export default DAOPage
