import React, {FunctionComponent, MouseEvent} from "react"
import {Link} from "react-router-dom"
import "./styles.scss"
import {NFTGalleryItemProps} from "../../types/NFT"
import CloseIcon from "../../icons/CloseIcon"

const GalleryItem: FunctionComponent<NFTGalleryItemProps> = ({
	id,
	thumbnail,
	name,
	isVideo,
	onDelete
}) => {
	const handleDelete = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		onDelete()
	}

	return (
		<div className="gallery__item">
			<div className="gallery__item-thumb">
				<Link to={`/nft/${id}`}>
					<div className="gallery__item-delete" onClick={handleDelete}>
						<CloseIcon />
					</div>
					{isVideo ? <video src={thumbnail} autoPlay muted /> : <img src={thumbnail} alt={name} />}
				</Link>
			</div>

			<div className="gallery__details">
				<div className="gallery__details-name">
					<Link to={`/nft/${id}`}>{name}</Link>
				</div>
			</div>
		</div>
	)
}

const Gallery: FunctionComponent<{items: NFTGalleryItemProps[]}> = ({items}) => (
	<div className="gallery">
		{items.map(item => (
			<GalleryItem
				onDelete={item.onDelete}
				key={item.id}
				id={item.id}
				thumbnail={item.thumbnail}
				name={item.name}
				isVideo={item.isVideo}
			/>
		))}
	</div>
)

export default Gallery
