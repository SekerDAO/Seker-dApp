import React  from 'react'
import { useParams } from 'react-router-dom'
import Button from './../Forms/Button'
import useNFT from "../../customHooks/useNFT.js"
import Loader from "../Loader"
import ErrorPlaceholder from "../ErrorPlaceholder"
import './styles.scss'

const NFTCard = () => {
	const { id } = useParams()
	const {NFT, loading, error} = useNFT(id)
	
	if (error) return <ErrorPlaceholder/>
	if (loading || !NFT) return <Loader/>

	const {
		nftName,
		nftThumbnail,
		nftPrice,
		nftDesc
	} = NFT

	return (
		<div className="nftcard">
			<div className="hero">
				<img src={nftThumbnail} />
			</div>
			<div className="nftdetails">
				<ul>
					<li>
						<h1>
							{nftName}
						</h1>
					</li>
					<li>
						<span>
							{nftPrice}
						</span>
					</li>
					<li>
						<div className="purchasenft">
							<Button>
								Purchase
							</Button>
						</div>
					</li>
					<li>
						<span
							dangerouslySetInnerHTML={{ __html: nftDesc }} />
					</li>
				</ul>
			</div>
		</div>
	)
}

export default NFTCard
