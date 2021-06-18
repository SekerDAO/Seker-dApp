import React, {FunctionComponent, useContext} from "react"
import Input from "../../Controls/Input"
import Table from "../../Table"
import CreateGalleryDAOModal from "../CreateGalleryDAOModal"
import "./styles.scss"
import CreateHouseDAOModal from "../CreateHouseDAOModal"
import useMyDAOs from "../../../customHooks/getters/useMyDAOs"
import Loader from "../../Loader"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import {AuthContext} from "../../../context/AuthContext"
import {Link} from "react-router-dom"
import SearchIcon from "../../../icons/SearchIcon"

const columns = [
	{
		id: "name",
		name: "DAO Name",
		rowClassName: "purple",
		// eslint-disable-next-line react/display-name
		render: (dao: {name: string; id: string}) => <Link to={`/dao/${dao.id}`}>{dao.name}</Link>
	},
	{
		id: "type",
		name: "DAO Type"
	},
	{
		id: "memberSince",
		name: "Member Since"
	},
	{
		id: "role",
		name: "DAO Role"
	},
	{
		id: "edit",
		name: "",
		// eslint-disable-next-line react/display-name
		render: () => <div className="profile-daos__edit" /> // TODO: icon
	}
] as const

const ProfileDAOs: FunctionComponent = () => {
	const {DAOs, loading, error} = useMyDAOs()
	const {account} = useContext(AuthContext)

	if (error) return <ErrorPlaceholder />
	if (!DAOs || loading) return <Loader />

	return (
		<>
			<div className="profile__edit-buttons">
				<CreateGalleryDAOModal />
				<CreateHouseDAOModal />
			</div>
			<div className="profile__controls">
				<div className="profile__search">
					<Input placeholder="Search" borders="bottom" />
					<SearchIcon />
				</div>
			</div>
			<div className="profile-daos__table">
				<Table
					data={DAOs.map(DAO => {
						const {name, tokenAddress, type, members} = DAO.data()
						const member = members.find(m => m.address === account)
						return {
							name,
							tokenAddress,
							type,
							memberSince: member?.memberSince?.split("T")[0] ?? "",
							role: member?.role ?? "",
							edit: "",
							id: DAO.id
						}
					})}
					columns={columns}
					idCol="id"
				/>
			</div>
		</>
	)
}

export default ProfileDAOs
