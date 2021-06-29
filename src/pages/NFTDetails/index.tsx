import React, {FunctionComponent} from "react"
import {useParams} from "react-router-dom"
import Button from "../../components/Controls/Button"
import useNFT from "../../customHooks/getters/useNFT"
import Loader from "../../components/Loader"
import ErrorPlaceholder from "../../components/ErrorPlaceholder"
import "./styles.scss"

const NFTCard: FunctionComponent = () => {
	const {id} = useParams<{id: string}>()
	const {NFT, loading, error} = useNFT(id)

	if (error) return <ErrorPlaceholder />
	if (loading || !NFT) return <Loader />

	const {name, thumbnail, price, desc} = NFT

	return (
		<div className="main__container">
			<div className="nftcard">
				<div className="hero">
					{NFT.media.mimeType.startsWith("video") ? <video src={thumbnail} autoPlay muted /> : <img src={thumbnail} />}
				</div>
				<div className="nftdetails">
					<ul>
						<li>
							<h1>{name}</h1>
						</li>
						<li>
							<span>{price}</span>
						</li>
						<li>
							<div className="purchasenft">
								<Button>Purchase</Button>
							</div>
						</li>
						<li>
							<span>{desc}</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
	)
}

export default NFTCard
