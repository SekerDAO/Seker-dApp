import React, {FunctionComponent, useState} from "react"
import Input from "../../Controls/Input"
import Select from "../../Controls/Select"
import Gallery from "../../Gallery"
import Button from "../../Controls/Button"
import {NFTSnapshot} from "../../../types/NFT"
import useNFTs from "../../../customHooks/useNFTs"
import ErrorPlaceholder from "../../ErrorPlaceholder"
import Loader from "../../Loader"

const ProfileGallery: FunctionComponent<{account: string}> = ({account}) => {
	const [cursor, setCursor] = useState<NFTSnapshot | null>(null)
	const {NFTs, loading, error} = useNFTs({user: account, after: cursor})

	if (error) return <ErrorPlaceholder />
	if (loading) return <Loader />

	const handleLoadMore = () => {
		setCursor(NFTs.data[NFTs.data.length - 1])
	}

	return (
		<>
			<div className="profile__controls">
				<Input placeholder="Search" borders="bottom" />
				<Select options={[{name: "Sort By", value: ""}]} />
			</div>
			<Gallery
				items={NFTs.data.map(doc => {
					const {nftThumbnail, nftName, nftPrice, media} = doc.data()
					return {
						id: doc.id,
						thumbnail: nftThumbnail,
						name: nftName,
						price: nftPrice,
						isVideo: media.mimeType.startsWith("video")
					}
				})}
			/>
			{NFTs.data.length < NFTs.totalCount && <Button onClick={handleLoadMore}>Load More</Button>}
		</>
	)
}

export default ProfileGallery
