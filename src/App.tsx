import {Component, FunctionComponent} from "react"
import {Switch, Route, BrowserRouter} from "react-router-dom"
import {ToastContainer} from "react-toastify"
import "react-toastify/dist/ReactToastify.min.css"
import Footer from "./components/Footer"
import Header from "./components/Header"
import NetworkChecker from "./components/NetworkChecker"
import ErrorPlaceholder from "./components/UI/ErrorPlaceholder"
import "./components/UI/Toast/styles.scss"
import {AuthContext, useAuth} from "./context/AuthContext"
import ProviderContext, {useProvider} from "./context/ProviderContext"
import "./default.scss"
import Dao from "./pages/Dao"
import Daos from "./pages/Daos"
import Homepage from "./pages/Homepage"
import Learn from "./pages/Learn"
import NFTDetails from "./pages/NftDetails"
import Profile from "./pages/Profile"

const AppPure: FunctionComponent = () => {
	const auth = useAuth()

	return (
		<BrowserRouter>
			<AuthContext.Provider value={auth}>
				<NetworkChecker />
				<div className="main">
					<Header />
					<ToastContainer />
					<Switch>
						<Route exact path="/" component={Homepage} />
						<Route exact path="/learn" component={Learn} />
						<Route exact path="/nft/:id" component={NFTDetails} />
						<Route exact path="/profile/:userId" component={Profile} />
						<Route exact path="/dao/:address" component={Dao} />
						<Route exact path="/daos" component={Daos} />
					</Switch>
					<Footer />
				</div>
			</AuthContext.Provider>
		</BrowserRouter>
	)
}

const AppWithEthers: FunctionComponent = () => {
	const ethers = useProvider()

	return (
		<ProviderContext.Provider value={ethers}>
			<AppPure />
		</ProviderContext.Provider>
	)
}

export default class App extends Component<{[k: string]: never}, {error: boolean}> {
	state = {
		error: false
	}

	componentDidCatch(e: Error): void {
		console.error(e)
		this.setState({error: true})
	}

	render(): JSX.Element {
		if (this.state.error) {
			return <ErrorPlaceholder />
		}
		return <AppWithEthers />
	}
}
