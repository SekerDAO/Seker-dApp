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
import "./default.scss"

const App: FunctionComponent = () => {
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
							path="/galleries/:filters"
							render={() => (
								<MainLayout>
									<Galleries />
								</MainLayout>
							)}
						/>
						<Route
							path="/nft/:id"
							render={() => (
								<MainLayout>
									<NFTDetails />
								</MainLayout>
							)}
						/>
						{/* TODO */}
						{/*<Route path="/dashboard" render={() => (*/}
						{/*  <WithAuth>*/}
						{/*    <DashboardLayout>*/}
						{/*      <Dashboard />*/}
						{/*    </DashboardLayout>*/}
						{/*  </WithAuth>*/}
						{/*)} />*/}
						{/*<Route path="/admin" render={() => (*/}
						{/*  <WithAdminAuth>*/}
						{/*    <AdminLayout>*/}
						{/*      <Admin />*/}
						{/*    </AdminLayout>*/}
						{/*  </WithAdminAuth>*/}
						{/*)} />*/}
					</Switch>
				</div>
			</AuthContext.Provider>
		</BrowserRouter>
	)
}

export default App
