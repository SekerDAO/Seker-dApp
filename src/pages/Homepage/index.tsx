import {FunctionComponent, MutableRefObject, useEffect, useRef} from "react"
import {Link} from "react-router-dom"
import Button from "../../components/Controls/Button"
import "./styles.scss"

const Homepage: FunctionComponent = () => {
	const videoRef = useRef<HTMLVideoElement>()
	useEffect(() => {
		videoRef.current!.autoplay = true
		videoRef.current!.loop = true
	}, [])

	return (
		<div className="home-page">
			<video
				ref={videoRef as MutableRefObject<HTMLVideoElement>}
				src="/assets/Homepage_Video.mp4"
				preload="none"
				muted
				loop
				poster="/assets/homepage.webp"
			/>
			<h1 className="home-page__title">
				Welcome to <br /> Seker
			</h1>
			<div className="home-page__buttons">
				<Link to="/daos">
					<Button>DAOs</Button>
				</Link>
				<Button disabled>Events</Button>
			</div>
			<div style={{color: "white", margin: "20px 80px"}}>
				We are currently in test phase but will be officially
				<br /> releasing in December 2021. Stay tuned!
			</div>
			<Link className="home-page__link" to="/learn">
				Learn More
			</Link>
		</div>
	)
}

export default Homepage
