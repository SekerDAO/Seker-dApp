import {FunctionComponent, useState} from "react"
import SearchInput from "../Controls/Input/SearchInput"
import Select from "../Controls/Select"
import Gallery from "../Gallery"
import Button from "../Controls/Button"
import {NFTSnapshot, NftSort} from "../../types/NFT"
import useNFTs from "../../hooks/getters/useNFTs"
import ErrorPlaceholder from "../UI/ErrorPlaceholder"
import Loader from "../UI/Loader"
import {toastError, toastSuccess} from "../UI/Toast"
import deleteDAONFT from "../../api/firebase/NFT/deleteDaoNft"
import deleteNft from "../../api/firebase/NFT/deleteNft"
import ConfirmationModal from "../Modals/ConfirmationModal"

const NFTGallery: FunctionComponent<{
	account: string
	isDao?: boolean
	canDelete: boolean
}> = ({account, canDelete, isDao = false}) => {
	const [cursor, setCursor] = useState<NFTSnapshot | null>(null)
	const [sort, setSort] = useState<NftSort>("dateDesc")
	const [deleteOpened, setDeleteOpened] = useState<string | null>(null)
	const [deletedNfts, setDeletedNfts] = useState<string[]>([])
	const {NFTs, loading, error} = useNFTs({user: account, after: cursor, sort})

	if (error) return <ErrorPlaceholder />
	if (loading) return <Loader />

	const handleLoadMore = () => {
		setCursor(NFTs.data[NFTs.data.length - 1])
	}

	const handleSortChange = (newSortValue: string) => {
		setSort(newSortValue as NftSort)
		setCursor(null)
	}

	const handleDelete = async (id: string) => {
		try {
			if (isDao) {
				await deleteDAONFT(id, account)
			} else {
				await deleteNft(id)
			}
			toastSuccess("NFT successfully deleted!")
			setDeletedNfts(prevState => [...prevState, id])
		} catch (e) {
			console.error(e)
			toastError("Failed to delete NFT")
		}
	}

	return (
		<>
			{canDelete && (
				<ConfirmationModal
					title="Delete Confirmation"
					text={`Are you sure you want to delete this NFT?\n\n(Note: This will not remove the NFT from the Ethereum Blockchain\n but rather just from our website's database and your profile. To recover\n an accidentally deleted NFT, follow the steps to load NFT.)`}
					onSubmit={() => handleDelete(deleteOpened!)}
					submitText="Delete"
					isOpened={!!deleteOpened}
					handleClose={() => {
						setDeleteOpened(null)
					}}
				/>
			)}
			<div className="profile__controls">
				<SearchInput />
				<Select<string>
					value={sort}
					placeholder="Sort By"
					options={[
						{name: "Newest", value: "dateDesc"},
						{name: "Oldest", value: "dateAsc"},
						{name: "Name (A-Z)", value: "nameAsc"},
						{name: "Name (Z-A)", value: "nameDesc"}
					]}
					onChange={handleSortChange}
				/>
			</div>
			<Gallery
				items={NFTs.data
					.filter(doc => !deletedNfts.includes(doc.id))
					.map(doc => {
						const {thumbnail, name, media, creator, attributes} = doc.data()
						return {
							id: doc.id,
							thumbnail,
							name,
							creator,
							attributes,
							isVideo: media.mimeType.startsWith("video"),
							onDelete: canDelete
								? () => {
										setDeleteOpened(doc.id)
								  }
								: undefined
						}
					})}
			/>
			{NFTs.data.length < NFTs.totalCount && <Button onClick={handleLoadMore}>Load More</Button>}
		</>
	)
}

export default NFTGallery
