import React from 'react'
import { Link } from 'react-router-dom'
import './styles.scss'

const Gallery = ({
	id,
	thumbnail,
	name,
	price
}) => (
	<div className='gallery'>
		<div className="thumb">
			<Link to={`/nft/${id}`}>
				{thumbnail.slice(-1) === 'g' &&
				<img src={thumbnail} alt={name} />}
				{thumbnail.slice(-1) === '4' &&
				<video src={thumbnail} autoPlay muted loop/>}
			</Link>
		</div>
		
		<div className="details">
			<ul>
				<li>
						<span className="name">
							<Link to={`/nft/${id}`}>
								{name}
							</Link>
						</span>
				</li>
				<li>
						<span className="price">
							{price}Ξ
						</span>
				</li>
			</ul>
		</div>
	</div>
)

export default Gallery
