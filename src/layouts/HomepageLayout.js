import React from 'react'
import Header from './../components/Header'
import Footer from './../components/Footer'
import MainTop from './../components/MainTop'

const HomepageLayout = props => {
	return (
		<div className="fullHeight">
			<Header {...props} />
			<MainTop />
			{props.children}
			<Footer />
		</div>
	)
}

export default HomepageLayout