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
import {formatDate} from "../../utlls"

const menuEntries = ["Collection", "About", "Members", "Proposals", "+ Admin Proposal"]

const DAOPage: FunctionComponent = () => {
	const {account, connected} = useContext(AuthContext)
	const {address} = useParams<{address: string}>()
	const {dao, loading, error, refetch} = useDAO(address)
	const [editOpened, setEditOpened] = useState(false)
	const [activeMenuIndex, setActiveMenuIndex] = useState(0)

	if (error) return <ErrorPlaceholder />
	if (!dao || loading) return <Loader />

	const isMember = connected && !!dao.members.find(m => m.address === account)
	const isAdmin = connected && !!dao.members.find(m => m.address === account && m.role === "admin")

	return (
		<>
			<DashboardHeader background={dao.headerImage}>
				{isAdmin && editOpened && (
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
							{isAdmin && editOpened && (
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
							<p>Est. {formatDate(dao.estimated)}</p>
							{dao.website && (
								<a href={`https://${dao.website}`} target="_blank" rel="noopener noreferrer">
									{dao.website}
								</a>
							)}
							{(dao.twitter || dao.telegram || dao.discord) && (
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
							)}
							{isAdmin && (
								<Button
									buttonType="primary"
									onClick={() => {
										setEditOpened(true)
									}}
								>
									Edit DAO Profile
								</Button>
							)}
							{/* TODO: link */}
							{!isMember && <Button>Purchase tokens</Button>}
							{/* TODO: decentralize DAO modal */}
							{/*{dao.daoAddress ? (*/}
							{/*	<p>TODO: Decentralized DAO</p>*/}
							{/*) : isAdmin ? (*/}
							{/*	<DecentralizeDAOModal*/}
							{/*		afterSubmit={refetch}*/}
							{/*		gnosisAddress={dao.gnosisAddress}*/}
							{/*		gnosisVotingThreshold={dao.gnosisVotingThreshold}*/}
							{/*	/>*/}
							{/*) : null}*/}
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
								{activeMenuIndex === 0 && <DAOCollection gnosisAddress={dao.gnosisAddress} />}
								{activeMenuIndex === 1 && <AboutDAO dao={dao} />}
								{activeMenuIndex === 3 && (
									<DAOProposals
										gnosisVotingThreshold={dao.gnosisVotingThreshold}
										gnosisAddress={dao.gnosisAddress}
										daoAddress={dao.daoAddress}
										isMember={isMember}
										isAdmin={isAdmin}
									/>
								)}
								{activeMenuIndex === 4 && (
									<CreateDAOProposal
										isMember={isMember}
										isAdmin={isAdmin}
										daoAddress={dao.daoAddress}
										gnosisAddress={dao.gnosisAddress}
										gnosisVotingThreshold={dao.gnosisVotingThreshold}
									/>
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
