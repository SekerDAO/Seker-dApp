import React, {FunctionComponent} from "react"
import {Switch, Route, BrowserRouter} from "react-router-dom"
import {AuthContext, useAuth} from "./customHooks/useAuth"
import AdminToolbar from "./components/AdminToolbar"
import MainLayout from "./layouts/MainLayout"
import HomepageLayout from "./layouts/HomepageLayout"
import Homepage from "./pages/Homepage"
import Learn from "./pages/Learn"
import Galleries from "./pages/Galleries"
import NFTDetails from "./pages/NFTDetails"
import Profile from "./pages/Profile"
import "./default.scss"
import EthersContext, {useEthers} from "./customHooks/useEthers"
import NetworkChecker from "./components/NetworkChecker"

const AppWithEthers: FunctionComponent = () => {
	const auth = useAuth()

	return (
		<BrowserRouter>
			<AuthContext.Provider value={auth}>
				<div className="App">
					<AdminToolbar />
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<HomepageLayout>
									<Homepage />
								</HomepageLayout>
							)}
						/>
						<Route
							exact
							path="/learn"
							render={() => (
								<MainLayout>
									<Learn />
								</MainLayout>
							)}
						/>
						<Route
							exact
							path="/galleries"
							render={() => (
								<MainLayout>
									<Galleries />
								</MainLayout>
							)}
						/>
						<Route
							exact
							path="/galleries/:category"
							render={() => (
								<MainLayout>
									<Galleries />
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
