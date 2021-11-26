import {ReactComponent as CloseIcon} from "../../assets/icons/delete.svg"
import {NFTGalleryItemProps} from "../../types/NFT"
import {formatReadableAddress} from "../../utlls"
import "./styles.scss"
import {FunctionComponent, MouseEvent} from "react"
import {Link} from "react-router-dom"

const GalleryItem: FunctionComponent<NFTGalleryItemProps> = ({
	id,
	thumbnail,
	name,
	isVideo,
	onDelete,
	creator,
	attributes
}) => {
	const handleDelete = (e: MouseEvent<HTMLDivElement>) => {
		e.preventDefault()
		if (!onDelete) return
		onDelete()
	}

	return (
		<div className="gallery__item">
			<div className="gallery__item-thumb">
				<Link to={`/nft/${id}`}>
					{onDelete && (
						<div className="gallery__item-delete" onClick={handleDelete}>
							<CloseIcon />
						</div>
					)}
					{isVideo ? <video src={thumbnail} autoPlay muted /> : <img src={thumbnail} alt={name} />}
				</Link>
			</div>

			<div className="gallery__details">
				<div className="gallery__details-row">
					<b>
						<Link to={`/nft/${id}`}>{name}</Link>
					</b>
					{attributes?.editionNumber && attributes.numberOfEditions && (
						<div>
							Edition {attributes.editionNumber} of {attributes.numberOfEditions}
						</div>
					)}
				</div>
				<div className="gallery__details-row">
					<div>{formatReadableAddress(creator)}</div>
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
				attributes={item.attributes}
				creator={item.creator}
			/>
		))}
	</div>
)

export default Gallery
