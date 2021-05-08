import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import "./styles.scss"

const HomePage: FunctionComponent = () => {
	return (
		<div className="directory">
			<div className="wrap">
				<div
					className="gallery"
					style={{
						backgroundImage: `url("/assets/gallery.jpeg")`
					}}
				>
					<Link to="/galleries" className="a">
						View Galleries
					</Link>
				</div>
				<div
					className="gallery"
					style={{
						backgroundImage: `url("/assets/gallery.jpeg")`
					}}
				>
					<a>View Exhibits</a>
				</div>
			</div>
		</div>
	)
}

export default HomePage
