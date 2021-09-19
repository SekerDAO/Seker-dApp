import React, {ChangeEvent, FunctionComponent, useState} from "react"
import Input from "../Controls/Input"
import Select from "../Controls/Select"
import Gallery from "../Gallery"
import Button from "../Controls/Button"
import {NFTSnapshot, NftSort} from "../../types/NFT"
import useNFTs from "../../customHooks/getters/useNFTs"
import ErrorPlaceholder from "../ErrorPlaceholder"
import Loader from "../Loader"
import SearchIcon from "../../icons/SearchIcon"
import {toastError, toastSuccess} from "../Toast"
import deleteDAONFT from "../../api/firebase/NFT/deleteDAONFT"
import deleteNFT from "../../api/firebase/NFT/deleteNFT"
import ConfirmationModal from "../Modals/ConfirmationModal"

const NFTGallery: FunctionComponent<{
	account: string
	isDao?: boolean
}> = ({account, isDao = false}) => {
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
			<ConfirmationModal
				title="Delete Confirmation"
				text="Are you sure you want to delete NFT?"
				onSubmit={() => handleDelete(deleteOpened!)}
				submitText="Delete"
				isOpened={!!deleteOpened}
				handleClose={() => {
					setDeleteOpened(null)
				}}
			/>
			<div className="profile__controls">
				<div className="profile__search">
					<Input placeholder="Search" borders="bottom" />
					<SearchIcon />
				</div>
				<Select
					value={sort}
					options={[
						{name: "Name A-Z", value: "nameAsc"},
						{name: "Name Z-A", value: "nameDesc"},
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
						const {thumbnail, name, media} = doc.data()
						return {
							id: doc.id,
							thumbnail,
							name,
							isVideo: media.mimeType.startsWith("video"),
							onDelete: () => {
								setDeleteOpened(doc.id)
							}
						}
					})}
			/>
			{NFTs.data.length < NFTs.totalCount && <Button onClick={handleLoadMore}>Load More</Button>}
		</>
	)
}

export default NFTGallery
