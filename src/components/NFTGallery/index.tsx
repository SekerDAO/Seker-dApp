import React, {ChangeEvent, FunctionComponent, useState} from "react"
import deleteDAONFT from "../../api/firebase/NFT/deleteDAONFT"
import deleteNFT from "../../api/firebase/NFT/deleteNFT"
import useNFTs from "../../customHooks/getters/useNFTs"
import SearchIcon from "../../icons/SearchIcon"
import {NFTSnapshot, NftSort} from "../../types/NFT"
import Button from "../Controls/Button"
import Input from "../Controls/Input"
import Select from "../Controls/Select"
import ErrorPlaceholder from "../ErrorPlaceholder"
import Gallery from "../Gallery"
import Loader from "../Loader"
import ConfirmationModal from "../Modals/ConfirmationModal"
import {toastError, toastSuccess} from "../Toast"

const NFTGallery: FunctionComponent<{
	account: string
	isDao?: boolean
	canDelete: boolean
}> = ({account, canDelete, isDao = false}) => {
	const [cursor, setCursor] = useState<NFTSnapshot | null>(null)
	const [sort, setSort] = useState<NftSort>("nameAsc")
	const [deleteOpened, setDeleteOpened] = useState<string | null>(null)
	const [deletedNfts, setDeletedNfts] = useState<string[]>([])
	const {NFTs, loading, error} = useNFTs({user: account, after: cursor, sort})

	if (error) return <ErrorPlaceholder />
	if (loading) return <Loader />

	const handleLoadMore = () => {
		setCursor(NFTs.data[NFTs.data.length - 1])
	}

	const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
		setSort(e.target.value as NftSort)
		setCursor(null)
	}

	const handleDelete = async (id: string) => {
		try {
			if (isDao) {
				await deleteDAONFT(id, account)
			} else {
				await deleteNFT(id)
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
					// isOpened={!!deleteOpened}
					handleClose={() => {
						setDeleteOpened(null)
					}}
				/>
			)}
			<div className="profile__controls">
				<div className="profile__search">
					<Input placeholder="Search" borders="bottom" />
					<SearchIcon />
				</div>
				<Select
					value={sort}
					options={[
						{name: "Name (A-Z)", value: "nameAsc"},
						{name: "Name (Z-A)", value: "nameDesc"},
						{name: "Newest", value: "dateDesc"},
						{name: "Oldest", value: "dateAsc"}
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
