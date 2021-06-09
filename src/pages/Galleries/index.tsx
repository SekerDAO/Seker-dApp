import React, {ChangeEvent, FunctionComponent, useState} from "react"
import {useHistory, useParams} from "react-router-dom"
import Gallery from "../../components/Gallery"
import Select from "../../components/Controls/Select"
import useNFTs from "../../customHooks/useNFTs"
import Loader from "../../components/Loader"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Button from "../../components/Controls/Button"
import {NFTSnapshot} from "../../types/NFT"
import "./styles.scss"

const Galleries: FunctionComponent = () => {
	const history = useHistory()
	const {category} = useParams<{category: string}>()
	const [cursor, setCursor] = useState<NFTSnapshot | null>(null)
	const {NFTs, loading, error} = useNFTs({category, after: cursor})

	if (error) return <ErrorPlaceholder />
	if (loading) return <Loader />
	if (NFTs.data.length === 0) {
		return <p> No Search Results </p>
	}

	const handleFilter = (e: ChangeEvent<HTMLSelectElement>) => {
		history.push(`/galleries/${e.target.value}`)
	}

	const handleLoadMore = () => {
		setCursor(NFTs.data[NFTs.data.length - 1])
	}

	return (
		// <div className="galleries">
		// 	<div className="galleryResults">
		// 		<h1>Browse Galleries</h1>

		// 		<Select
		// 			defaultValue={category}
		// 			options={[
		// 				{
		// 					name: "Show All",
		// 					value: ""
		// 				},
		// 				{
		// 					name: "Gallery",
		// 					value: "gallery"
		// 				},
		// 				{
		// 					name: "Exhibit",
		// 					value: "exhibit"
		// 				}
		// 			]}
		// 			onChange={handleFilter}
		// 		/>
		// 		<Gallery
		// 			items={NFTs.data.map(doc => {
		// 				const {thumbnail, name, price, media} = doc.data()
		// 				return {
		// 					id: doc.id,
		// 					thumbnail,
		// 					name,
		// 					price,
		// 					isVideo: media.mimeType.startsWith("video")
		// 				}
		// 			})}
		// 		/>
		// 	</div>

		// 	{NFTs.data.length < NFTs.totalCount && <Button onClick={handleLoadMore}>Load More</Button>}
		// </div>
		<div>
			<h1>Coming Soon!</h1>
		</div>
	)
}

export default Galleries
