import React, {FunctionComponent} from "react"
import Header from "../components/Header"
import Footer from "../components/Footer"

const MainLayout: FunctionComponent = ({children}) => {
	return (
		<div className="mainLayout">
			<Header />
			<div className="main">{children}</div>
			<Footer />
		</div>
	)
}

export default MainLayout
