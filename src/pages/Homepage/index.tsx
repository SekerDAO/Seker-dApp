import React, {FunctionComponent} from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import Button from "../../components/Controls/Button"
import "./styles.scss"

const HomePage: FunctionComponent = () => {
	return (
		<div className="home-page">
			<Header background={false} />
			<video src="/assets/Homepage_Video.mp4" muted autoPlay loop />
			<h1 className="home-page__title">
				Welcome To <br /> TokenWalk
			</h1>
			<div className="home-page__buttons">
				<Button>House DAOs</Button>
				<Button buttonType="secondary">About Aplha</Button>
			</div>
			<Footer />
		</div>
	)
}

export default HomePage
