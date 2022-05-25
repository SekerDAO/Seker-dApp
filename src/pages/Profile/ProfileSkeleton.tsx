import {FunctionComponent} from "react"
import Skeleton from "../../components/UI/Skeleton"

const ProfileSkeleton: FunctionComponent = () => (
	<>
		<Skeleton variant="rectangular" className="dashboard-header" />
		<div className="main__container">
			<div className="profile">
				<Skeleton variant="circular" className="profile__photo" />
				<div className="profile__info">
					<h2>
						<Skeleton variant="text" />
					</h2>
					<Skeleton variant="rectangular" height="200px" />
					<Skeleton variant="text" />
				</div>
			</div>
		</div>
	</>
)

export default ProfileSkeleton
