import React, {FunctionComponent} from "react"
import {Switch, Route, BrowserRouter} from "react-router-dom"
import {AuthContext, useAuth} from "./context/AuthContext"
import MainLayout from "./layouts/MainLayout"
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

const AppWithEthers: FunctionComponent = () => {
	const auth = useAuth()

	return (
		<BrowserRouter>
			<AuthContext.Provider value={auth}>
				<div className="App">
					<ToastContainer />
					<Switch>
						<Route exact path="/" render={() => <Homepage />} />
						<Route
							exact
							path="/learn"
							render={() => (
								<MainLayout headerBackground={false} headerHeight={160}>
									<Learn />
								</MainLayout>
							)}
						/>
						<Route
							exact
							path="/nft/:id"
							render={() => (
								<MainLayout>
									<NFTDetails />
								</MainLayout>
							)}
						/>
						<Route
							exact
							path="/profile/:account"
							render={() => (
								<MainLayout>
									<Profile />
								</MainLayout>
							)}
						/>
						<Route
							exact
							path="/dao/:address"
							render={() => (
								<MainLayout>
									<DAOPage />
								</MainLayout>
							)}
						/>
						<Route
							exact
							path="/houses"
							render={() => (
								<MainLayout headerBackground={false} headerHeight={160}>
									<DAOsPage />
								</MainLayout>
							)}
						/>
						<Route
							exact
							path="/galleries"
							render={() => (
								<MainLayout headerBackground={false} headerHeight={160}>
									<DAOsPage />
								</MainLayout>
							)}
						/>
					</Switch>
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
