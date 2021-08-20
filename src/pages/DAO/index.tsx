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
import DAOCollection from "../../components/DAO/DAOCollection"
import UploadImageModal from "../../components/Modals/UploadImageModal"
import updateDAOImage from "../../api/firebase/DAO/updateDAOImage"
import TwitterIcon from "../../icons/TwitterIcon"
import {PURPLE_2} from "../../constants/colors"
import TelegramIcon from "../../icons/TelegramIcon"
import DiscordIcon from "../../icons/DiscordIcon"
import DashboardHeader from "../../components/DashboardHeader"
import DecentralizeDAOModal from "../../components/Modals/DecentralizeDAOModal"

const houseMenuEntries = ["About", "Members", "Proposals", "Create Proposal", "Collection"]
const galleryMenuEntries = ["Collection", "About", "Members", "Proposals", "Create Proposal"]

const DAOPage: FunctionComponent = () => {
	const {account, connected} = useContext(AuthContext)
	const {address} = useParams<{address: string}>()
	const {dao, loading, error, refetch} = useDAO(address)
	const [editOpened, setEditOpened] = useState(false)
	const [activeMenuIndex, setActiveMenuIndex] = useState(0)

	if (error) return <ErrorPlaceholder />
	if (!dao || loading) return <Loader />

	const isMember = connected && !!dao.members.find(m => m.address === account)
	const isAdmin = !!dao.members.find(
		m => ["head", "admin"].includes(m.role) && m.address === account
	)

	const menuEntries = dao.type === "house" ? houseMenuEntries : galleryMenuEntries

	return (
		<>
			<DashboardHeader background={dao.headerImage}>
				{isAdmin && (
					<UploadImageModal
						initialUrl={dao.headerImage}
						buttonName="Edit Header"
						titleText="Edit DAO Header"
						onUpload={async file => {
							await updateDAOImage(file, dao!.gnosisAddress, "header")
							refetch()
						}}
						successToastText="DAO header successfully updated"
						errorToastText="Failed to update DAO header"
					/>
				)}
			</DashboardHeader>
			<div className="main__container">
				<div className="dao">
					<div className="dao__left-section">
						<div
							className="dao__photo"
							style={{
								backgroundImage: `url(${dao.profileImage ?? "/assets/DAODashboard_Photo.png"})`
							}}
						>
							{isAdmin && (
								<UploadImageModal
									initialUrl={dao.profileImage}
									buttonName="Edit Image"
									titleText="Edit DAO Image"
									onUpload={async file => {
										await updateDAOImage(file, dao!.gnosisAddress, "profile")
										refetch()
									}}
									successToastText="DAO image successfully updated"
									errorToastText="Failed to update DAO image"
								/>
							)}
						</div>
						<div className="dao__info">
							<h2>{dao.name}</h2>
							<p>est. {dao.estimated.split("T")[0]}</p>
							<p>{dao.website}</p>
							<div className="dao__socials">
								{dao.twitter && (
									<a
										target="_blank"
										rel="noopener noreferrer"
										href={`https://twitter.com/${dao.twitter}`}
									>
										<TwitterIcon fill={PURPLE_2} />
									</a>
								)}
								{dao.telegram && (
									<a
										target="_blank"
										rel="noopener noreferrer"
										href={`https://t.me/${dao.telegram}`}
									>
										<TelegramIcon fill={PURPLE_2} />
									</a>
								)}
								{dao.discord && (
									<a
										target="_blank"
										rel="noopener noreferrer"
										href={`https://discord.gg/${dao.discord}`}
									>
										<DiscordIcon fill={PURPLE_2} />
									</a>
								)}
							</div>
							{isAdmin ? (
								<>
									<Button
										buttonType="primary"
										onClick={() => {
											setEditOpened(true)
										}}
									>
										Edit House Profile
									</Button>
									<DecentralizeDAOModal
										afterSubmit={refetch}
										gnosisAddress={dao.gnosisAddress}
										type={dao.type}
									/>
								</>
							) : (
								<>
									<Button buttonType="primary">Join House</Button>
								</>
							)}
						</div>
					</div>
					<div className="dao__main">
						{editOpened ? (
							<EditDAO
								dao={dao}
								afterEdit={refetch}
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
								{menuEntries[activeMenuIndex] === "About" && <AboutDAO dao={dao} />}
								{menuEntries[activeMenuIndex] === "Proposals" && (
									<DAOProposals
										gnosisVotingThreshold={dao.gnosisVotingThreshold}
										gnosisAddress={dao.gnosisAddress}
										daoAddress={dao.daoAddress}
										isMember={isMember}
										isAdmin={isAdmin}
									/>
								)}
								{menuEntries[activeMenuIndex] === "Create Proposal" && (
									<CreateDAOProposal
										isMember={isMember}
										isAdmin={isAdmin}
										daoAddress={dao.daoAddress}
										gnosisAddress={dao.gnosisAddress}
										gnosisVotingThreshold={dao.gnosisVotingThreshold}
									/>
								)}
								{menuEntries[activeMenuIndex] === "Collection" && (
									<DAOCollection gnosisAddress={dao.gnosisAddress} />
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default DAOPage
