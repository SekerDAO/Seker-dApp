import React, {FunctionComponent} from "react"
import {useParams} from "react-router-dom"
import Button from "../../components/Controls/Button"
import useNFT from "../../customHooks/useNFT"
import Loader from "../../components/Loader"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import "./styles.scss"

const NFTCard: FunctionComponent = () => {
	const {id} = useParams<{id: string}>()
	const {NFT, loading, error} = useNFT(id)

	if (error) return <ErrorPlaceholder />
	if (loading || !NFT) return <Loader />

	const {nftName, nftThumbnail, nftPrice, nftDesc} = NFT

	return (
		<div className="nftcard">
			<div className="hero">
				<img src={nftThumbnail} />
			</div>
			<div className="nftdetails">
				<ul>
					<li>
						<h1>{nftName}</h1>
					</li>
					<li>
						<span>{nftPrice}</span>
					</li>
					<li>
						<div className="purchasenft">
							<Button>Purchase</Button>
						</div>
					</li>
					<li>
						<span>{nftDesc}</span>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default NFTCard
