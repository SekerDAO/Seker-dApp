import {FunctionComponent} from "react"
import {useHistory} from "react-router-dom"
import {DAO} from "../../../types/DAO"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Loader"
import DashboardHeader from "../../UI/DashboardHeader"
import DashboardMenu from "../../UI/DashboardMenu"
import HorizontalMenu from "../../UI/HorizontalMenu"
import UploadImageModal from "../../Modals/UploadImageModal"
import Paper from "../../UI/Paper"
import {ReactComponent as TwitterIcon} from "../../../assets/icons/twitter.svg"
import {ReactComponent as TelegramIcon} from "../../../assets/icons/telegram.svg"
import {ReactComponent as DiscordIcon} from "../../../assets/icons/discord.svg"
import {formatDate} from "../../../utlls"
import updateDAOImage from "../../../api/firebase/DAO/updateDAOImage"
import "./styles.scss"

type DAOAdminPage = "createNFT" | "edit" | "createProposal" | "expand"
type DAOContentPage = "collection" | "about" | "members" | "proposals"

export const daoMenuEntries = [
	{id: "collection", name: "Collection"},
	{id: "about", name: "About"},
	{id: "members", name: "Members"},
	{id: "proposals", name: "Proposals"}
]

const DAODashboard: FunctionComponent<{
	dao?: DAO | null
	page: DAOAdminPage | DAOContentPage
	isAdmin: boolean
	error: boolean
	loading: boolean
	refetch?: () => void
}> = ({dao, page, isAdmin, error, loading, refetch, children}) => {
	const {push} = useHistory()

	if (error) return <ErrorPlaceholder />
	if (!dao || loading) return <Loader />

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
							refetch && refetch()
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
										refetch && refetch()
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
						{isAdmin && (
							<DashboardMenu
								items={[
									{
										title: "Create / Load NFTs",
										to: `/dao/${dao.gnosisAddress}?page=createNFT`,
										page: "createNFT"
									},
									{
										title: "Edit DAO Profile",
										to: `/dao/${dao.gnosisAddress}?page=edit`,
										page: "edit"
									},
									{
										title: "Create Proposal",
										to: `/dao/${dao.gnosisAddress}?page=createProposal`,
										page: "createProposal"
									},
									{
										title: "Expand Dao",
										to: `/dao/${dao.gnosisAddress}?page=expand`,
										page: "expand"
									}
								]}
								currentPage={page}
							/>
						)}
					</div>
					<div className="dao__main">
						<HorizontalMenu
							pages={daoMenuEntries}
							currentPage={page}
							onChange={nextPage => {
								push(`/dao/${dao.gnosisAddress}?page=${nextPage}`)
							}}
						/>
						{children}
					</div>
				</div>
			</div>
		</>
	)
}

export default DAODashboard
