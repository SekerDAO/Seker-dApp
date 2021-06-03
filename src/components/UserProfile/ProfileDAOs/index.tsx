import React, {FunctionComponent} from "react"
import Input from "../../Controls/Input"
import Table from "../../Table"
import CreateGalleryDAOModal from "../CreateGalleryDAOModal"
import "./styles.scss"
import CreateHouseDAOModal from "../CreateHouseDAOModal"

const columns = [
	{
		id: "name",
		name: "DAO Name",
		rowClassName: "purple"
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
		id: "roles",
		name: "DAO Role(s)"
	},
	{
		id: "edit",
		name: "",
		// eslint-disable-next-line react/display-name
		render: () => <div className="profile-daos__edit" /> // TODO: icon
	}
] as const

//TODO
const mockData = [
	{
		id: 1,
		name: "Gallery DAO 1",
		type: "gallery",
		memberSince: new Date().toISOString().split("T")[0],
		roles: "admin",
		edit: ""
	},
	{
		id: 2,
		name: "House DAO 1",
		type: "house",
		memberSince: new Date().toISOString().split("T")[0],
		roles: "guest",
		edit: ""
	},
	{
		id: 3,
		name: "Gallery DAO 2",
		type: "gallery",
		memberSince: new Date().toISOString().split("T")[0],
		roles: "collaborator",
		edit: ""
	}
]

const ProfileDAOs: FunctionComponent = () => {
	return (
		<>
			<div className="profile__edit-buttons">
				<CreateGalleryDAOModal />
				<CreateHouseDAOModal />
			</div>
			<div className="profile__controls">
				<Input placeholder="Search" borders="bottom" />
			</div>
			<div className="profile-daos__table">
				<Table data={mockData} columns={columns} idCol="id" />
			</div>
		</>
	)
}

export default ProfileDAOs
