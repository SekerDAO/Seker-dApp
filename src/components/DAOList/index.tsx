import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import {DAOListItemProps} from "../../types/DAO"
import "./styles.scss"

const DAOListItem: FunctionComponent<DAOListItemProps> = ({
	gnosisAddress,
	name,
	description,
	membersCount,
	profileImage
}) => (
	<Link to={`/dao/${gnosisAddress}`}>
		<div className="dao-list__item">
			<div
				className="dao-list__item-image"
				style={{backgroundImage: `url("${profileImage ?? "/assets/DAODashboard_Photo.png"}")`}}
			/>
			<h3>{name}</h3>
			<p>
				<b>Size:</b>
			</p>
			<p>
				{membersCount} member{membersCount > 1 ? "s" : ""}
			</p>
			{description && (
				<>
					<p>
						<b>About:</b>
					</p>
					<p>
						{description.slice(0, 40)}
						{description.length > 40 && "..."}
					</p>
				</>
			)}
		</div>
	</Link>
)

const DAOList: FunctionComponent<{
	DAOs: DAOListItemProps[]
}> = ({DAOs}) => (
	<div className="dao-list">
		{DAOs.map(dao => (
			<DAOListItem
				key={dao.gnosisAddress}
				gnosisAddress={dao.gnosisAddress}
				name={dao.name}
				description={dao.description}
				membersCount={dao.membersCount}
				profileImage={dao.profileImage}
			/>
		))}
	</div>
)

export default DAOList
