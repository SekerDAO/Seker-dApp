import React, {FunctionComponent} from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Button from "../../components/Controls/Button"
import "./styles.scss"
import {Link} from "react-router-dom"

const HomePage: FunctionComponent = () => {
	return (
		<div className="home-page">
			<Header background={false} />
			<video src="/assets/Homepage_Video.mp4" muted autoPlay loop />
			<h1 className="home-page__title">
				Welcome To <br /> TokenWalk
			</h1>
			<div className="home-page__buttons">
				<Link to="/houses">
					<Button>Houses</Button>
				</Link>
				<Link to="/galleries">
					<Button buttonType="secondary">Galleries</Button>
				</Link>
			</div>
			<Link className="home-page__link" to="/learn">
				About Alpha
			</Link>
			<Footer />
		</div>
	)
}

export default HomePage
