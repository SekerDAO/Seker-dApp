import React from 'react'
import Header from './../components/Header'
import Footer from './../components/Footer'

const MainLayout = props => {
	return (
		<div className="mainLayout">
			<Header {...props} />
			<div className="main">
				{props.children}
			</div>
			<Footer />
		</div>

	)
}

export default MainLayout