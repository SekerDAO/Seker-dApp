import {FunctionComponent, useContext} from "react"
import {Link} from "react-router-dom"
import {AuthContext} from "../../../context/AuthContext"
import useMyDAOs from "../../../hooks/getters/useMyDAOs"
import SearchInput from "../../Controls/Input/SearchInput"
import BookmarkDAOModal from "../../Modals/BookmarkDAOModal"
import CreateGnosisSafeModal from "../../Modals/CreateGnosisSafeModal"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Loader"
import Table from "../../UI/Table"
import "./styles.scss"

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
		id: "votingThreshold",
		name: "Voting Weight"
	},
	{
		id: "membershipInfo",
		name: "Membership Info"
	}
] as const

const ProfileDAOs: FunctionComponent = () => {
	const {DAOs, loading, error, refetch} = useMyDAOs()
	const {account} = useContext(AuthContext)

	const handleDeleteDAO = (gnosisAddress: string | number) => {
		console.log("TODO: Implement me!")
	}

	const handleBookmarkDAO = (daoAddress: string) => {
		console.log("TODO: Implement me!")
	}

	if (error) return <ErrorPlaceholder />
	if (!DAOs || loading) return <Loader />

	return (
		<>
			<div className="profile__edit-buttons">
				<CreateGnosisSafeModal afterCreate={refetch} />
			</div>
			<div className="profile__controls">
				<div>
					<SearchInput />
				</div>
				<div>
					<BookmarkDAOModal onSubmit={handleBookmarkDAO} />
				</div>
			</div>
			<div className="profile-daos__table">
				<Table
					data={DAOs.map(({name, owners, gnosisAddress, gnosisVotingThreshold}) => {
						const membershipInfo = account && owners.indexOf(account) !== -1 ? "Admin" : ""
						return {
							name,
							membershipInfo,
							gnosisAddress,
							votingThreshold: `${(gnosisVotingThreshold / owners.length) * 100}%`
						}
					})}
					columns={columns}
					idCol="gnosisAddress"
					onItemDelete={handleDeleteDAO}
					noDataText="No DAOs in your list yet. Start a DAO or bookmark one."
				/>
			</div>
		</>
	)
}

export default ProfileDAOs
