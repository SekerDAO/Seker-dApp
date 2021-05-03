import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchNFTStart, setNFT } from './../../redux/NFTs/nft.actions'
import Button from './../Forms/Button'
import './styles.scss'

const mapState = state => ({
	nft: state.nftData.nft
})

const NFTCard = ({}) => {
	const dispatch = useDispatch()
	const { nftID } = useParams()
	const { nft } = useSelector(mapState)

	const {
		nftName,
		nftThumbnail,
		nftPrice,
		nftDesc
	} = nft

	useEffect(() => {
		dispatch(
			fetchNFTStart(nftID)
		)

		return () => {
			dispatch(
				setNFT({})
			)
		}
	}, [])

	const configPurchaseBtn = {
		type: 'button'
	}

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
							<Button {...configPurchaseBtn}>
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