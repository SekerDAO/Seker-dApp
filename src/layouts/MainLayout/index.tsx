import React, {FunctionComponent} from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./styles.scss"

const MainLayout: FunctionComponent<{
	headerBackground?: boolean
	headerHeight?: number
}> = ({headerBackground = true, headerHeight, children}) => {
	return (
		<div className="main">
			<Header background={headerBackground} height={headerHeight} />
			<div className="main__container">{children}</div>
			<Footer />
		</div>
	)
}

export default MainLayout
