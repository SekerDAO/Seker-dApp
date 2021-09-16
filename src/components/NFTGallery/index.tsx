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

const NFTGallery: FunctionComponent<{account: string}> = ({account}) => {
	const [cursor, setCursor] = useState<NFTSnapshot | null>(null)
	const [sort, setSort] = useState<NftSort>("nameAsc")
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

	return (
		<>
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
				items={NFTs.data.map(doc => {
					const {thumbnail, name, media} = doc.data()
					return {
						id: doc.id,
						thumbnail,
						name,
						isVideo: media.mimeType.startsWith("video")
					}
				})}
			/>
			{NFTs.data.length < NFTs.totalCount && <Button onClick={handleLoadMore}>Load More</Button>}
		</>
	)
}

export default NFTGallery
