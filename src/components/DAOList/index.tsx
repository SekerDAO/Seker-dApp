import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import {DAOListItemProps} from "../../types/DAO"
import "./styles.scss"

const DAOListItem: FunctionComponent<DAOListItemProps> = ({
	gnosisAddress,
	name,
	description,
	owners,
	profileImage
}) => (
	<Link to={`/dao/${gnosisAddress}`}>
		<div className="dao-list__item">
			<div
				className="dao-list__item-image"
				style={profileImage ? {backgroundImage: `url("${profileImage}")`} : {}}
			/>
			<h3>{name}</h3>
			<p>
				<b>Size:</b>
			</p>
			<p>
				{owners.length} owner{owners.length > 1 ? "s" : ""}
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
				owners={dao.owners}
				profileImage={dao.profileImage}
			/>
		))}
	</div>
)

export default DAOList
