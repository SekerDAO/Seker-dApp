import {FunctionComponent} from "react"
import {DAO} from "../../../types/DAO"
import {UserWithAccount} from "../../../types/user"
import UploadImageModal from "../../Modals/UploadImageModal"
import DashboardHeader from "../DashboardHeader"
import "./styles.scss"

// TODO: Refactor DAO pages and User page
const Dashboard: FunctionComponent<{
	entity: DAO | UserWithAccount
	editable?: boolean
	entityName: "DAO" | "User"
	onHeaderUpload?: (file: File) => Promise<void>
	onPhotoUpload?: (file: File) => Promise<void>
}> = ({
	entity: {headerImage, profileImage, name},
	editable,
	entityName,
	onHeaderUpload,
	onPhotoUpload,
	children
}) => {
	return (
		<section className="dashboard">
			<DashboardHeader background={headerImage}>
				{editable && onHeaderUpload && (
					<UploadImageModal
						initialUrl={headerImage}
						buttonName="Edit Header"
						titleText={`Edit ${entityName} Header`}
						onUpload={onHeaderUpload}
						successToastText={`${entityName} header successfully updated`}
						errorToastText={`Failed to update ${entityName} header`}
					/>
				)}
			</DashboardHeader>
			<aside className="dashboard__sidebar">
				<div
					className="dashboard__sidebar-photo"
					style={
						profileImage
							? {
									backgroundImage: `url(${profileImage})`
							  }
							: {}
					}
				>
					{editable && onPhotoUpload && (
						<UploadImageModal
							initialUrl={headerImage}
							buttonName="Edit Avatar"
							titleText={`Edit ${entityName} Avatar`}
							onUpload={onPhotoUpload}
							successToastText={`${entityName} avatar successfully updated`}
							errorToastText={`Failed to update ${entityName} avatar`}
						/>
					)}
				</div>
				<div className="dashboard__sidebar-info">
					<h2>{name}</h2>
				</div>
			</aside>
			<section className="dashboard__content">{children}</section>
		</section>
	)
}

export default Dashboard
