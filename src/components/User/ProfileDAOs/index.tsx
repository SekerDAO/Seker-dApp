import {FunctionComponent, useContext} from "react"
import Input from "../../Controls/Input"
import Table from "../../Table"
import "./styles.scss"
import useMyDAOs from "../../../hooks/getters/useMyDAOs"
import Loader from "../../Loader"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import {AuthContext} from "../../../context/AuthContext"
import {Link} from "react-router-dom"
import SearchIcon from "../../../assets/icons/SearchIcon"
import CreateGnosisSafeModal from "../../Modals/CreateGnosisSafeModal"

const columns = [
	{
		id: "name",
		name: "DAO Name",
		rowClassName: "purple",
		// eslint-disable-next-line react/display-name
		render: (dao: {name: string; gnosisAddress: string}) => (
			<Link to={`/dao/${dao.gnosisAddress}`}>{dao.name}</Link>
		)
	},
	{
		id: "isAdmin",
		name: "DAO Role"
	}
] as const

const ProfileDAOs: FunctionComponent = () => {
	const {DAOs, loading, error, refetch} = useMyDAOs()
	const {account} = useContext(AuthContext)

	if (error) return <ErrorPlaceholder />
	if (!DAOs || loading) return <Loader />

	return (
		<>
			<div className="profile__edit-buttons">
				<CreateGnosisSafeModal afterCreate={refetch} />
			</div>
			<div className="profile__controls">
				<div className="profile__search">
					<Input placeholder="Search" borders="bottom" />
					<SearchIcon />
				</div>
			</div>
			<div className="profile-daos__table">
				<Table
					data={DAOs.map(dao => {
						const {name, owners} = dao
						const isAdmin = account && owners.indexOf(account) !== -1 ? "Admin" : ""
						return {
							name,
							isAdmin,
							gnosisAddress: dao.gnosisAddress
						}
					})}
					columns={columns}
					idCol="gnosisAddress"
				/>
			</div>
		</>
	)
}

export default ProfileDAOs
