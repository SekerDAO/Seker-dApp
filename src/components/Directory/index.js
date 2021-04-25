import React from 'react'
import Gallery from './../../assets/gallery.jpeg'
import Exhibit from './../../assets/exhibit.jpg'
import { Link } from 'react-router-dom'
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
					<Link to="/galleries" className="a">
						View Galleries
					</Link>
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