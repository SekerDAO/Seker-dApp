import React, {ChangeEvent, FunctionComponent, useState} from "react"
import {useHistory, useParams} from "react-router-dom"
import Gallery from "../../components/Gallery"
import FormSelect from "../../components/Forms/FormSelect"
import useNFTs from "../../customHooks/useNFTs"
import Loader from "../../components/Loader"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Button from "../../components/Forms/Button"
import {NFTSnapshot} from "../../types/NFT"
import "./styles.scss"

const Galleries: FunctionComponent = () => {
	const history = useHistory()
	const {filters} = useParams<{filters: string}>()
	const [cursor, setCursor] = useState<NFTSnapshot | null>(null)
	const {NFTs, loading, error} = useNFTs({filters, after: cursor})

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
		<div className="galleries">
			<div className="galleryResults">
				<h1>Browse Galleries</h1>

				<FormSelect
					defaultValue={filters}
					options={[
						{
							name: "Show All",
							value: ""
						},
						{
							name: "Gallery",
							value: "gallery"
						},
						{
							name: "Exhibit",
							value: "exhibit"
						}
					]}
					onChange={handleFilter}
				/>

				{NFTs.data.map(doc => {
					const {nftThumbnail, nftName, nftPrice} = doc.data()
					const {id} = doc
					if (!id || !nftThumbnail || !nftName || nftPrice === undefined) {
						return null
					}
					return <Gallery key={id} id={id} thumbnail={nftThumbnail} name={nftName} price={nftPrice} />
				})}
			</div>

			{NFTs.data.length < NFTs.totalCount && <Button onClick={handleLoadMore}>Load More</Button>}
		</div>
	)
}

export default Galleries
