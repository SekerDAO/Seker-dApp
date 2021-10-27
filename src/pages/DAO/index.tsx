import {FunctionComponent, useContext} from "react"
import {useHistory, useLocation, useParams} from "react-router-dom"
import {parse} from "query-string"
import HorizontalMenu from "../../components/HorizontalMenu"
import "./styles.scss"
import useDAO from "../../hooks/getters/useDAO"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Loader from "../../components/Loader"
import {AuthContext} from "../../context/AuthContext"
import AboutDAO from "../../components/DAO/AboutDAO"
import CreateDaoAdminProposal from "../../components/DAO/CreateDaoAdminProposal"
import DAOProposals from "../../components/DAO/DAOProposals"
import EditDAO from "../../components/DAO/EditDAO"
import DAOCollection from "../../components/DAO/DAOCollection"
import UploadImageModal from "../../components/Modals/UploadImageModal"
import updateDAOImage from "../../api/firebase/DAO/updateDAOImage"
import TwitterIcon from "../../assets/icons/TwitterIcon"
import {PURPLE_2} from "../../constants/colors"
import TelegramIcon from "../../assets/icons/TelegramIcon"
import DiscordIcon from "../../assets/icons/DiscordIcon"
import DashboardHeader from "../../components/DashboardHeader"
import {formatDate} from "../../utlls"
import DAOOwners from "../../components/DAO/DAOOwners"
import DecentralizeDAOModal from "../../components/Modals/DecentralizeDAOModal"
import Paper from "../../components/Paper"
import DashboardMenu from "../../components/DashboardMenu"

type DAOAdminPage = "nfts" | "edit" | "createProposal" | "expand"
type DAOContentPage = "collection" | "about" | "members" | "proposals"

const menuEntries = [
	{id: "collection", name: "Collection"},
	{id: "about", name: "About"},
	{id: "members", name: "Members"},
	{id: "proposals", name: "Proposals"}
]

// Make sense to rebuild all this internal "page" handling to plain react-router routes
const DAOPage: FunctionComponent = () => {
	const {account, connected} = useContext(AuthContext)
	const {address} = useParams<{address: string}>()
	const {dao, loading, error, refetch} = useDAO(address)
	const {pathname, search} = useLocation()
	const {push} = useHistory()

	if (error) return <ErrorPlaceholder />
	if (!dao || loading) return <Loader />

	const isAdmin = connected && !!dao.owners.find(addr => addr === account)
	const page: DAOAdminPage | DAOContentPage =
		(isAdmin && (parse(search).page as DAOAdminPage | DAOContentPage)) || "collection"

	return (
		<>
			<DashboardHeader background={dao.headerImage}>
				{isAdmin && page === "edit" && (
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
							{isAdmin && page === "edit" && (
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
						<Paper className="dao__info">
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
							{/* TODO: decentralize DAO modal */}
							{/* {dao.seeleAddress ? (
								<p>TODO: Decentralized DAO</p>
							) : isAdmin ? (
								<DecentralizeDAOModal
									afterSubmit={refetch}
									gnosisAddress={dao.gnosisAddress}
									gnosisVotingThreshold={dao.gnosisVotingThreshold}
								/>
							) : null} */}
						</Paper>
						{isAdmin && (
							<DashboardMenu
								items={[
									{
										title: "Create / Load NFTs",
										to: `${pathname}?page=nfts`,
										page: "nfts"
									},
									{
										title: "Edit DAO Profile",
										to: `${pathname}?page=edit`,
										page: "edit"
									},
									{
										title: "Create Proposal",
										to: `${pathname}?page=createProposal`,
										page: "createProposal"
									},
									{
										title: "Expand Dao",
										to: `${pathname}?page=expand`,
										page: "expand"
									}
								]}
								currentPage={page}
							/>
						)}
					</div>
					<div className="dao__main">
						{page === "edit" ? (
							<EditDAO
								dao={dao}
								afterEdit={refetch}
								onClose={() => {
									push(pathname)
								}}
							/>
						) : (
							<>
								<HorizontalMenu
									pages={menuEntries}
									currentPage={page}
									onChange={nextPage => {
										push(`${pathname}?page=${nextPage}`)
									}}
								/>
								{page === "collection" && (
									<DAOCollection gnosisAddress={dao.gnosisAddress} isAdmin={isAdmin} />
								)}
								{page === "about" && <AboutDAO dao={dao} />}
								{page === "members" && <DAOOwners owners={dao.owners} />}
								{page === "proposals" && (
									<DAOProposals
										gnosisVotingThreshold={dao.gnosisVotingThreshold}
										gnosisAddress={dao.gnosisAddress}
										isAdmin={isAdmin}
									/>
								)}
								{page === "createProposal" && isAdmin && (
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
