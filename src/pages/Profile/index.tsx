import React, {FunctionComponent, useState} from "react"
import {useParams} from "react-router-dom"
import useNFTs from "../../customHooks/useNFTs"
import {NFTSnapshot} from "../../types/NFT"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import Loader from "../../components/Loader"
import Gallery from "../../components/Gallery"
import Button from "../../components/Controls/Button"
import Select from "../../components/Controls/Select"
import "./styles.scss"
import Input from "../../components/Controls/Input"

const Profile: FunctionComponent = () => {
	const {account} = useParams<{account: string}>()
	const [cursor, setCursor] = useState<NFTSnapshot | null>(null)
	const {NFTs, loading, error} = useNFTs({user: account.toUpperCase(), after: cursor})

	if (error) return <ErrorPlaceholder />
	if (loading) return <Loader />

	const handleLoadMore = () => {
		setCursor(NFTs.data[NFTs.data.length - 1])
	}

	return (
		<div className="profile">
			<div className="profile__photo" />
			<div className="profile__info">
				<h2>TODO: name</h2>
				<p>{`${account.slice(0, 3)}...${account.slice(-4)}`}</p>
				<p>TODO: description</p>
			</div>
			<div className="profile__main">
				<div className="profile__controls">
					<Input placeholder="Search" />
					<Select options={[{name: "Sort By", value: ""}]} />
				</div>
				<Gallery
					items={NFTs.data.map(doc => {
						const {nftThumbnail, nftName, nftPrice} = doc.data()
						return {
							id: doc.id,
							thumbnail: nftThumbnail,
							name: nftName,
							price: nftPrice
						}
					})}
				/>
			</div>
			{NFTs.data.length < NFTs.totalCount && <Button onClick={handleLoadMore}>Load More</Button>}
		</div>
	)
}

export default Profile
