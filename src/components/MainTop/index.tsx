import React, {FunctionComponent} from "react"
import {Link} from "react-router-dom"
import "./styles.scss"

const MainTop: FunctionComponent = () => {
	return (
		<div className="top">
			<div
				className="topImage"
				style={{
					backgroundImage: `url("/assets/aiweiwei.jpg")`
				}}
			>
				<div className="welcomeTo">
					Welcome To <br /> TokenWalk
				</div>
				<div className="topButton1">
					<Link to="/galleries" className="a">
						Explore
					</Link>
				</div>
				<div className="topButton2">
					<Link to="/galleries" className="a">
						Create
					</Link>
				</div>
			</div>
		</div>
	)
}

export default MainTop
