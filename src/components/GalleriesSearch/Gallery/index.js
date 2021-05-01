import React from 'react'

const Gallery = ({
	nftThumbnail,
	nftName,
	nftPrice
}) => {
	if(!nftThumbnail || !nftName || typeof nftPrice === 'undefined') return null
	return(
		<div className='gallery'>
			<div className="thumb">
				<img src={nftThumbnail} alt={nftName} />
			</div>

			<div className="details">
				<ul>
					<li>
						<span className="name">
							{nftName}
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