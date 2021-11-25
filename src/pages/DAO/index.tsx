import {FunctionComponent, useContext} from "react"
import {useHistory, useLocation, useParams} from "react-router-dom"
import {parse} from "query-string"
import ErrorPlaceholder from "../../components/UI/ErrorPlaceholder"
import Loader from "../../components/UI/Loader"
import DAODashboard from "../../components/DAO/DAODashboard"
import useDAO from "../../hooks/getters/useDAO"
import {AuthContext} from "../../context/AuthContext"
import AboutDAO from "../../components/DAO/AboutDAO"
import DAOProposals from "../../components/DAO/DAOProposals"
import EditDAO from "../../components/DAO/EditDAO"
import NFTGallery from "../../components/NFTGallery"
import ExpandDAO from "../../components/DAO/ExpandDAO"
import DAOOwners from "../../components/DAO/DAOOwners"
import CreateNFTForm from "../../components/CreateNFTForm"
import useUser from "../../hooks/getters/useUser"
import CreateDaoProposal from "../../components/DAO/CreateDaoProposal"

type DAOAdminPage = "createNFT" | "edit" | "createProposal" | "expand"
type DAOContentPage = "collection" | "about" | "members" | "proposals"

export const daoMenuEntries = [
	{id: "collection", name: "Collection"},
	{id: "about", name: "About"},
	{id: "members", name: "Members"},
	{id: "proposals", name: "Proposals"}
]

// Make sense to rebuild all this internal "page" handling to plain react-router routes
const DAOPage: FunctionComponent = () => {
	const {account, connected} = useContext(AuthContext)
	const {user} = useUser(account as string)
	const {address} = useParams<{address: string}>()
	const {dao, loading, error, refetch} = useDAO(address)
	const {pathname, search} = useLocation()
	const {push} = useHistory()

	if (error) return <ErrorPlaceholder />
	if (!dao || loading) return <Loader />

	const isAdmin = connected && !!dao.owners.find(addr => addr === account)
	const page: DAOAdminPage | DAOContentPage =
		(parse(search).page as DAOAdminPage | DAOContentPage) || "collection"

	return (
		<DAODashboard
			dao={dao}
			loading={loading}
			error={error}
			refetch={refetch}
			isAdmin={isAdmin}
			page={page}
		>
			{isAdmin && page === "createNFT" && user && (
				<CreateNFTForm
					gnosisAddress={dao?.gnosisAddress}
					domains={user.myDomains}
					afterCreate={() => push(`${pathname}?page=collection`)}
				/>
			)}
			{isAdmin && page === "edit" && (
				<EditDAO
					dao={dao}
					afterEdit={refetch}
					onClose={() => {
						push(pathname)
					}}
				/>
			)}
			{isAdmin && page === "createProposal" && (
				<CreateDaoProposal
					gnosisAddress={dao.gnosisAddress}
					gnosisVotingThreshold={dao.gnosisVotingThreshold}
					ownersCount={dao.owners.length}
				/>
			)}
			{page === "collection" && (
				<NFTGallery account={dao.gnosisAddress} isDao canDelete={isAdmin} />
			)}
			{page === "about" && <AboutDAO dao={dao} />}
			{page === "members" && <DAOOwners owners={dao.owners} />}
			{page === "proposals" && <DAOProposals gnosisAddress={dao.gnosisAddress} />}
			{isAdmin && page === "expand" && (
				<ExpandDAO
					gnosisAddress={dao.gnosisAddress}
					gnosisVotingThreshold={dao.gnosisVotingThreshold}
					seeleAddress={dao.seeleAddress}
				/>
			)}
		</DAODashboard>
	)
}

export default DAOPage
