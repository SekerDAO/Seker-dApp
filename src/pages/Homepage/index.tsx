import React, {FunctionComponent} from "react"
import Button from "../../components/Controls/Button"
import "./styles.scss"
import {Link} from "react-router-dom"

const HomePage: FunctionComponent = () => {
	return (
		<div className="home-page">
			<video src="/assets/Homepage_Video.mp4" muted autoPlay loop />
			<h1 className="home-page__title">
				Welcome to <br /> TokenWalk
			</h1>
			<div className="home-page__buttons">
				<Link to="/daos">
					<Button>DAOs</Button>
				</Link>
				<Button disabled>Exhibits</Button>
			</div>
			<Link className="home-page__link" to="/learn">
				Learn More
			</Link>
		</div>
	)
}

export default HomePage
