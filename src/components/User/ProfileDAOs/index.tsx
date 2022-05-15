import {FunctionComponent, useContext, useState} from "react"
import {Link} from "react-router-dom"
import removeMyDao from "../../../api/firebase/DAO/removeMyDao"
import {AuthContext} from "../../../context/AuthContext"
import useMyDAOs from "../../../hooks/getters/useMyDAOs"
import SearchInput from "../../Controls/Input/SearchInput"
import BookmarkDAOModal from "../../Modals/BookmarkDAOModal"
import ConfirmationModal from "../../Modals/ConfirmationModal"
import CreateGnosisSafeModal from "../../Modals/CreateGnosisSafeModal"
import ErrorPlaceholder from "../../UI/ErrorPlaceholder"
import Loader from "../../UI/Skeleton"
import Table from "../../UI/Table"
import {toastError, toastSuccess} from "../../UI/Toast"
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
	const [removeDaoModalOpened, setRemoveDaoModalOpened] = useState<string | null>(null)

	const handleDeleteDAO = async () => {
		if (removeDaoModalOpened === null) return
		try {
			await removeMyDao(removeDaoModalOpened)
			toastSuccess("DAO successfully removed")
			refetch()
		} catch (e) {
			console.error(e)
			toastError("Failed to delete DAO")
		}
	}

	if (error) return <ErrorPlaceholder />
	if (!DAOs || loading) return <Loader />

	return (
		<>
			<ConfirmationModal
				title="Remove DAO"
				text={`Are you sure you want to remove dao ${removeDaoModalOpened} from your DAOs list?`}
				onSubmit={handleDeleteDAO}
				submitText="Remove"
				isOpened={removeDaoModalOpened !== null}
				handleClose={() => {
					setRemoveDaoModalOpened(null)
				}}
			/>
			<div className="profile__edit-buttons">
				<CreateGnosisSafeModal afterCreate={refetch} />
			</div>
			<div className="profile__controls">
				<div>
					<SearchInput />
				</div>
				<div>
					<BookmarkDAOModal afterSubmit={refetch} />
				</div>
			</div>
			<div className="profile-daos__table">
				<Table
					data={DAOs.map(({name, owners, gnosisAddress, gnosisVotingThreshold}) => ({
						name,
						membershipInfo: account && owners.indexOf(account) !== -1 ? "Admin" : "",
						gnosisAddress,
						votingThreshold: `${(gnosisVotingThreshold / owners.length) * 100}%`
					}))}
					columns={columns}
					idCol="gnosisAddress"
					onItemDelete={address => {
						setRemoveDaoModalOpened(address as string)
					}}
					noDataText="No DAOs in your list yet. Start a DAO or bookmark one."
				/>
			</div>
		</>
	)
}

export default ProfileDAOs
