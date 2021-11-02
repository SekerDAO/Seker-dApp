import {FunctionComponent, useContext} from "react"
import SearchInput from "../../Controls/Input/SearchInput"
import Table from "../../UI/Table"
import "./styles.scss"
import useMyDAOs from "../../../hooks/getters/useMyDAOs"
import Loader from "../../UI/Loader"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import {AuthContext} from "../../../context/AuthContext"
import {Link} from "react-router-dom"
import CreateGnosisSafeModal from "../../Modals/CreateGnosisSafeModal"
import Button from "../../Controls/Button"
import {ReactComponent as BookmarkIcon} from "../../../assets/icons/bookmark.svg"

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
	const handleDAODelete = (gnosisAddress: string | number) => {
		console.log("TODO: Implement me!", gnosisAddress)
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
					{/* TODO: Implement Add a DAO */}
					<Button buttonType="link" extraClassName="profile__add-dao">
						<BookmarkIcon width="15px" height="20px" />
						Add a DAO
					</Button>
				</div>
			</div>
			<div className="profile-daos__table">
				<Table
					data={DAOs.map(dao => {
						const {name, owners} = dao
						const isAdmin = account && owners.indexOf(account) !== -1 ? "Admin" : ""
						return {
							name,
							membershipInfo: isAdmin,
							votingThreshold: `${dao.gnosisVotingThreshold * 100}%`,
							gnosisAddress: dao.gnosisAddress
						}
					})}
					columns={columns}
					idCol="gnosisAddress"
					onItemDelete={gnosisAddress => handleDAODelete(gnosisAddress)}
				/>
			</div>
		</>
	)
}

export default ProfileDAOs
