import {parse} from "query-string"
import {FunctionComponent, useContext} from "react"
import {useHistory, useLocation, useParams} from "react-router-dom"
import updateDAOImage from "../../api/firebase/DAO/updateDAOImage"
import {ReactComponent as DiscordIcon} from "../../assets/icons/discord.svg"
import {ReactComponent as TelegramIcon} from "../../assets/icons/telegram.svg"
import {ReactComponent as TwitterIcon} from "../../assets/icons/twitter.svg"
import CreateNFTForm from "../../components/CreateNFTForm"
import AboutDAO from "../../components/DAO/AboutDAO"
import CreateDaoProposal from "../../components/DAO/CreateDaoProposal"
import DAOMembers from "../../components/DAO/DAOMembers"
import DAOProposals from "../../components/DAO/DAOProposals"
import EditDAO from "../../components/DAO/EditDAO"
import ExpandDAO from "../../components/DAO/ExpandDAO"
import Proposal from "../../components/DAO/Proposal"
import UploadImageModal from "../../components/Modals/UploadImageModal"
import NFTGallery from "../../components/NFTGallery"
import DashboardHeader from "../../components/UI/DashboardHeader"
import DashboardMenu from "../../components/UI/DashboardMenu"
import ErrorPlaceholder from "../../components/UI/ErrorPlaceholder"
import HorizontalMenu from "../../components/UI/HorizontalMenu"
import Loader from "../../components/UI/Loader"
import Paper from "../../components/UI/Paper"
import {AuthContext} from "../../context/AuthContext"
import useDAO from "../../hooks/getters/useDAO"
import useUser from "../../hooks/getters/useUser"
import {formatDate} from "../../utlls"
import "./styles.scss"

type DAOAdminPage = "createNFT" | "edit" | "createProposal" | "expand"
type DAOContentPage = "collection" | "about" | "members" | "proposals" | "proposal"

const menuEntries = [
	{id: "collection", name: "Collection"},
	{id: "about", name: "About"},
	{id: "members", name: "Members"},
	{id: "proposals", name: "Proposals"}
]

// Make sense to rebuild all this internal "page" handling to plain react-router routes
const Dao: FunctionComponent = () => {
	const {account, connected} = useContext(AuthContext)
	const {user} = useUser(account as string)
	const {address} = useParams<{address: string}>()
	const {dao, loading, error, refetch} = useDAO(address)
	const {pathname, search} = useLocation()
	const {push} = useHistory()

	if (error) return <ErrorPlaceholder />
	if (!dao || loading) return <Loader />

	const isAdmin = connected && !!dao.owners.find(addr => addr === account)
	const page: DAOAdminPage | DAOContentPage =
		(parse(search).page as DAOAdminPage | DAOContentPage) || "collection"

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
											<TwitterIcon width="24px" height="20px" />
										</a>
									)}
									{dao.telegram && (
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={`https://t.me/${dao.telegram}`}
										>
											<TelegramIcon width="24px" height="20px" />
										</a>
									)}
									{dao.discord && (
										<a
											target="_blank"
											rel="noopener noreferrer"
											href={`https://discord.gg/${dao.discord}`}
										>
											<DiscordIcon width="24px" height="20px" />
										</a>
									)}
								</div>
							)}
						</Paper>
						<DashboardMenu
							items={[
								{
									title: "Create / Load NFTs",
									to: `${pathname}?page=createNFT`,
									page: "createNFT"
								},
								...(isAdmin
									? [
											{
												title: "Edit DAO Profile",
												to: `${pathname}?page=edit`,
												page: "edit"
											}
									  ]
									: []),
								...(isAdmin || dao.usuls.length > 0
									? [
											{
												title: "Create Proposal",
												to: `${pathname}?page=createProposal`,
												page: "createProposal"
											}
									  ]
									: []),
								{
									title: "Expand Dao",
									to: `${pathname}?page=expand`,
									page: "expand"
								}
							]}
							currentPage={page}
						/>
					</div>
					<div className="dao__main">
						<HorizontalMenu
							pages={menuEntries}
							currentPage={page}
							onChange={nextPage => {
								push(`${pathname}?page=${nextPage}`)
							}}
						/>
						{page === "createNFT" && user && (
							<CreateNFTForm
								gnosisAddress={dao.gnosisAddress}
								domains={user.myDomains}
								afterCreate={() => push(`${pathname}?page=collection`)}
							/>
						)}
						{isAdmin && page === "edit" && (
							<EditDAO
								dao={dao}
								afterEdit={refetch}
								onClose={() => {
									push(pathname)
								}}
							/>
						)}
						{page === "createProposal" && (
							<CreateDaoProposal
								isAdmin={isAdmin}
								gnosisAddress={dao.gnosisAddress}
								usuls={dao.usuls}
								gnosisVotingThreshold={dao.gnosisVotingThreshold}
								ownersCount={dao.owners.length}
							/>
						)}
						{page === "collection" && (
							<NFTGallery account={dao.gnosisAddress} isDao canDelete={isAdmin} />
						)}
						{page === "about" && <AboutDAO dao={dao} />}
						{page === "members" && <DAOMembers dao={dao} />}
						{page === "proposals" && <DAOProposals gnosisAddress={dao.gnosisAddress} />}
						{page === "proposal" && <Proposal />}
						{page === "expand" && (
							<ExpandDAO
								gnosisAddress={dao.gnosisAddress}
								gnosisVotingThreshold={dao.gnosisVotingThreshold}
								afterDeployUsul={refetch}
								isAdmin={isAdmin}
							/>
						)}
					</div>
				</div>
			</div>
		</>
	)
}

export default Dao
