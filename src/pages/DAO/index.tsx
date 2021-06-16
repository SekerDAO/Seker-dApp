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

const menuEntries = ["About", "Members", "Proposals", "Create Proposal", "Collection"]

const DAOPage: FunctionComponent = () => {
	const {account, connected} = useContext(AuthContext)
	const {address} = useParams<{address: string}>()
	const [activeMenuIndex, setActiveMenuIndex] = useState(0)
	const {DAO, loading, error} = useDAO(address)

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
							<Button buttonType="secondary">Apply for Commission</Button>
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
				{activeMenuIndex === 0 && <AboutDAO dao={DAO} />}
				{activeMenuIndex === 2 && <DAOProposals daoAddress={DAO.address} />}
				{activeMenuIndex === 3 && <CreateDAOProposal isOwner={isOwner} daoAddress={DAO.address} />}
			</div>
		</div>
	)
}

export default DAOPage
