import {FunctionComponent, MouseEvent} from "react"
import {Link} from "react-router-dom"
import {ReactComponent as CloseIcon} from "../../assets/icons/delete.svg"
import {NFTGalleryItemProps} from "../../types/NFT"
import {formatReadableAddress} from "../../utlls"
import Skeleton from "../UI/Skeleton"
import "./styles.scss"

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

const Gallery: FunctionComponent<{items: NFTGalleryItemProps[]; loading: boolean}> = ({
	items,
	loading
}) => (
	<div className="gallery">
		{!loading &&
			items.map(item => (
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
		{loading && (
			<>
				<div className="gallery__item">
					<div className="gallery__item-thumb">
						<Skeleton variant="rectangular" height="240px" />
					</div>
					<div className="gallery__details">
						<Skeleton variant="text" className="gallery__details-row" />
						<Skeleton variant="text" className="gallery__details-row" />
					</div>
				</div>
				<div className="gallery__item">
					<div className="gallery__item-thumb">
						<Skeleton variant="rectangular" height="240px" />
					</div>
					<div className="gallery__details">
						<Skeleton variant="text" className="gallery__details-row" />
						<Skeleton variant="text" className="gallery__details-row" />
					</div>
				</div>
				<div className="gallery__item">
					<div className="gallery__item-thumb">
						<Skeleton variant="rectangular" height="240px" />
					</div>
					<div className="gallery__details">
						<Skeleton variant="text" className="gallery__details-row" />
						<Skeleton variant="text" className="gallery__details-row" />
					</div>
				</div>
			</>
		)}
		{!loading && !items.length && <div className="gallery__no-data">No data found.</div>}
	</div>
)

export default Gallery
