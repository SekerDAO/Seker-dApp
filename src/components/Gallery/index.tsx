import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import "./styles.scss"
import {NFTGalleryItemProps} from "../../types/NFT"

const GalleryItem: FunctionComponent<NFTGalleryItemProps> = ({
	id,
	thumbnail,
	name,
	price,
	isVideo
}) => (
	<div className="gallery__item">
		<div className="gallery__item-thumb">
			<Link to={`/nft/${id}`}>
				{isVideo ? <video src={thumbnail} autoPlay muted /> : <img src={thumbnail} alt={name} />}
			</Link>
		</div>

		<div className="gallery__details">
			<div className="gallery__details-name">
				<Link to={`/nft/${id}`}>{name}</Link>
			</div>
			{price !== undefined && <div className="gallery__details-price">{price}Ξ</div>}
		</div>
	</div>
)

const Gallery: FunctionComponent<{items: NFTGalleryItemProps[]}> = ({items}) => (
	<div className="gallery">
		{items.map(item => (
			<GalleryItem
				key={item.id}
				id={item.id}
				thumbnail={item.thumbnail}
				name={item.name}
				price={item.price}
				isVideo={item.isVideo}
			/>
		))}
	</div>
)

export default Gallery
