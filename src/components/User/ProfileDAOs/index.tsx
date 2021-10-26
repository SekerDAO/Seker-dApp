import {FunctionComponent, useContext} from "react"
import SearchInput from "../../Controls/Input/SearchInput"
import Table from "../../Table"
import "./styles.scss"
import useMyDAOs from "../../../hooks/getters/useMyDAOs"
import Loader from "../../Loader"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import {AuthContext} from "../../../context/AuthContext"
import {Link} from "react-router-dom"
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
		// TODO: Implement me!
	}

	if (error) return <ErrorPlaceholder />
	if (!DAOs || loading) return <Loader />

	return (
		<>
			<div className="profile__edit-buttons">
				<CreateGnosisSafeModal afterCreate={refetch} />
			</div>
			<div className="profile__controls">
				<SearchInput />
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
