import React from 'react'
import Gallery from './../../assets/gallery.jpeg'
import Exhibit from './../../assets/exhibit.jpg'
import './styles.scss'

const Directory = props => {
	return (
		<div className="directory">
			<div className="wrap">
				<div
					className="gallery"
					style={{
						backgroundImage: `url(${Gallery})`
					}}
				>
					<a>
						View Galleries
					</a>
				</div>
				<div 
					className="gallery"
					style={{
						backgroundImage: `url(${Exhibit})`
					}}
				>
					<a>
						View Exhibits
					</a>
				</div>
			</div>
		</div>
	)
}

export default Directory