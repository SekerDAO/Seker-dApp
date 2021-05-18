import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import "./styles.scss"

type GalleryItem = {
	id: string
	thumbnail: string
	name: string
	price: number
}

const GalleryItem: FunctionComponent<GalleryItem> = ({id, thumbnail, name, price}) => (
	<div className="gallery__item">
		<div className="gallery__item-thumb">
			<Link to={`/nft/${id}`}>
				{thumbnail.slice(-1) === "g" && <img src={thumbnail} alt={name} />}
				{thumbnail.slice(-1) === "4" && <video src={thumbnail} autoPlay muted loop />}
			</Link>
		</div>

		<div className="gallery__details">
			<div className="gallery__details-name">
				<Link to={`/nft/${id}`}>{name}</Link>
			</div>
			<div className="gallery__details-price">{price}Ξ</div>
		</div>
	</div>
)

const Gallery: FunctionComponent<{items: GalleryItem[]}> = ({items}) => (
	<div className="gallery">
		{items.map(item => (
			<GalleryItem key={item.id} id={item.id} thumbnail={item.thumbnail} name={item.name} price={item.price} />
		))}
	</div>
)

export default Gallery
