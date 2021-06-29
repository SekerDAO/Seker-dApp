import React, {FunctionComponent} from "react"
import {Switch, Route, BrowserRouter} from "react-router-dom"
import {AuthContext, useAuth} from "./context/AuthContext"
import Homepage from "./pages/Homepage"
import Learn from "./pages/Learn"
import NFTDetails from "./pages/NFTDetails"
import Profile from "./pages/Profile"
import EthersContext, {useEthers} from "./context/EthersContext"
import NetworkChecker from "./components/NetworkChecker"
import {ToastContainer} from "react-toastify"
import "./default.scss"
import "react-toastify/dist/ReactToastify.min.css"
import "./components/Toast/styles.scss"
import DAOPage from "./pages/DAO"
import DAOsPage from "./pages/DAOs"
import Header from "./components/Header"
import Footer from "./components/Footer"

const AppWithEthers: FunctionComponent = () => {
	const auth = useAuth()

	return (
		<BrowserRouter>
			<AuthContext.Provider value={auth}>
				<div className="main">
					<Header />
					<ToastContainer />
					<Switch>
						<Route exact path="/" component={Homepage} />
						<Route exact path="/learn" component={Learn} />
						<Route exact path="/nft/:id" component={NFTDetails} />
						<Route exact path="/profile/:account" component={Profile} />
						<Route exact path="/dao/:address" component={DAOPage} />
						<Route exact path="/houses" component={DAOsPage} />
						<Route exact path="/galleries" component={DAOsPage} />
					</Switch>
					<Footer />
				</div>
			</AuthContext.Provider>
		</BrowserRouter>
	)
}

const App: FunctionComponent = () => {
	const ethers = useEthers()

	return (
		<EthersContext.Provider value={ethers}>
			<NetworkChecker />
			<AppWithEthers />
		</EthersContext.Provider>
	)
}

export default App
