import React from 'react'
import { Link } from 'react-router-dom'

const Gallery = ({
	documentID,
	nftThumbnail,
	nftName,
	nftPrice
}) => {
	if(!documentID || !nftThumbnail || !nftName || typeof nftPrice === 'undefined') return null
	return(
		<div className='gallery'>
			<div className="thumb">
			<Link to={`/nft/${documentID}`}>
				{nftThumbnail.slice(-1) === 'g' &&
					<img src={nftThumbnail} alt={nftName} />}
				{nftThumbnail.slice(-1) === '4' &&
					<video src={nftThumbnail} alt={nftName} autoPlay muted loop/>}
			</Link>
			</div>

			<div className="details">
				<ul>
					<li>
						<span className="name">
							<Link to={`/nft/${documentID}`}>
								{nftName}
							</Link>
						</span>
					</li>
					<li>
						<span className="price">
							{nftPrice}Ξ
						</span>
					</li>
				</ul>
			</div>
		</div>
	)
}

export default Gallery