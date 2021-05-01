import React from 'react'
import TopImage from './../../assets/aiweiwei.jpg'
import { Link } from 'react-router-dom'
import Button from './../Forms/Button'
import './styles.scss'

const MainTop = props => {
	return (
		<div className="top">
				<div
					className="topImage"
					style={{
						backgroundImage: `url(${TopImage})`
					}}
				>
					<div className="welcomeTo">
						Welcome To <br/> TokenWalk
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