import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNFTsStart } from './../../redux/NFTs/nft.actions'
import Gallery from './Gallery'
import './styles.scss'

const mapState = ({ nftData }) => ({
	nfts: nftData.nfts
})

const GalleriesSearch = () => {
	const dispatch = useDispatch()
	const { nfts } = useSelector(mapState)

	useEffect(() => {
		dispatch(
			fetchNFTsStart()
		)
	}, [])

	//if(Array.isArray(nfts)) return null

	if(nfts.length < 1) {
		return (
			<p> No Search Results </p>
		)
	}

	return (
		<div className="galleries">
			<div className="galleryResults">
				<h1>
					Browse Galleries
				</h1>
				{nfts.map((nft, pos) => {
					const { nftThumbnail, nftName, nftPrice, nftCategory } = nft
					if(!nftThumbnail || !nftName || typeof nftPrice === 'undefined') return null
					const configGallery = {
						nftThumbnail,
						nftName,
						nftPrice
					}
					return(
						<Gallery {...configGallery} />
					)
				})}
			</div>
		</div>
	)
}

export default GalleriesSearch