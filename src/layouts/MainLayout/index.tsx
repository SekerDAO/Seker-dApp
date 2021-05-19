import React, {FunctionComponent} from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import "./styles.scss"

const MainLayout: FunctionComponent = ({children}) => {
	return (
		<div className="main">
			<Header />
			<div className="main__container">{children}</div>
			<Footer />
		</div>
	)
}

export default MainLayout
