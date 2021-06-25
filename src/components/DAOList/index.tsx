import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import {DAOListItemProps} from "../../types/DAO"
import "./styles.scss"

const DAOListItem: FunctionComponent<DAOListItemProps> = ({
	address,
	name,
	description,
	type,
	houseTokenType,
	membersCount
}) => (
	<Link to={`/dao/${address}`}>
		<div className="dao-list__item">
			<div className="dao-list__item-image" style={{backgroundImage: `url("/assets/DAODashboard_Photo.png")`}} />
			<h3>{name}</h3>
			<p>
				<b>Type:</b>
			</p>
			<p>{`${type === "house" ? `${houseTokenType} ` : ""}${type}`}</p>
			<p>
				<b>Size:</b>
			</p>
			<p>{membersCount} members</p>
			<p>
				<b>About:</b>
			</p>
			<p>{description}</p>
		</div>
	</Link>
)

const DAOList: FunctionComponent<{
	DAOs: DAOListItemProps[]
}> = ({DAOs}) => (
	<div className="dao-list">
		{DAOs.map(dao => (
			<DAOListItem
				key={dao.address}
				address={dao.address}
				type={dao.type}
				name={dao.name}
				description={dao.description}
				membersCount={dao.membersCount}
				houseTokenType={dao.houseTokenType}
			/>
		))}
	</div>
)

export default DAOList
