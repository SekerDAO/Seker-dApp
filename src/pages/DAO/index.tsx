import {FunctionComponent, useContext, useState} from "react"
import {useParams} from "react-router-dom"
import HorizontalMenu from "../../components/HorizontalMenu"
import "./styles.scss"
import useDAO from "../../customHooks/getters/useDAO"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Loader from "../../components/Loader"
import {AuthContext} from "../../context/AuthContext"
import Button from "../../components/Controls/Button"
import AboutDAO from "../../components/DAO/AboutDAO"
import CreateDaoAdminProposal from "../../components/DAO/CreateDaoAdminProposal"
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
import DAOOwners from "../../components/DAO/DAOOwners"

const menuEntries = ["Collection", "About", "Owners", "Proposals", "+ Admin Proposal"]

const DAOPage: FunctionComponent = () => {
	const {account, connected} = useContext(AuthContext)
	const {address} = useParams<{address: string}>()
	const {dao, loading, error, refetch} = useDAO(address)
	const [editOpened, setEditOpened] = useState(false)
	const [activeMenuIndex, setActiveMenuIndex] = useState(0)

	if (error) return <ErrorPlaceholder />
	if (!dao || loading) return <Loader />

	const isAdmin = connected && !!dao.owners.find(addr => addr === account)

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
							style={
								dao.profileImage
									? {
											backgroundImage: `url(${dao.profileImage})`
									  }
									: {}
							}
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
							<Button>Purchase tokens</Button>
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
									entries={isAdmin ? menuEntries : menuEntries.slice(0, -1)}
									activeIndex={activeMenuIndex}
									onChange={index => {
										setActiveMenuIndex(index)
									}}
								/>
								{activeMenuIndex === 0 && (
									<DAOCollection gnosisAddress={dao.gnosisAddress} isAdmin={isAdmin} />
								)}
								{activeMenuIndex === 1 && <AboutDAO dao={dao} />}
								{activeMenuIndex === 2 && <DAOOwners owners={dao.owners} />}
								{activeMenuIndex === 3 && (
									<DAOProposals
										gnosisVotingThreshold={dao.gnosisVotingThreshold}
										gnosisAddress={dao.gnosisAddress}
										isAdmin={isAdmin}
									/>
								)}
								{activeMenuIndex === 4 && isAdmin && (
									<CreateDaoAdminProposal
										gnosisAddress={dao.gnosisAddress}
										gnosisVotingThreshold={dao.gnosisVotingThreshold}
										ownersCount={dao.owners.length}
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
