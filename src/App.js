import React from 'react'
import { Switch, Route } from 'react-router-dom'

// components
import AdminToolbar from './components/AdminToolbar'

// layouts
import MainLayout from './layouts/MainLayout'
import HomepageLayout from './layouts/HomepageLayout'

// pages
import Homepage from './pages/Homepage'
import Learn from './pages/Learn'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Galleries from './pages/Galleries'
import Recovery from './pages/Recovery'
import NFTDetails from './pages/NFTDetails'
import './default.scss'

const App = () => (
	<div className="App">
		<AdminToolbar />
		<Switch>
			<Route exact path="/" render={() => (
				<HomepageLayout>
					<Homepage />
				</HomepageLayout>
			)} />
			<Route path="/learn" render={() => (
				<MainLayout>
					<Learn />
				</MainLayout>
			)} />
			<Route path="/registration"
			       render={() => (
				       <MainLayout>
					       <Registration />
				       </MainLayout>
			       )} />
			<Route path="/login"
			       render={() => (
				       <MainLayout>
					       <Login />
				       </MainLayout>
			       )} />
			<Route exact path="/galleries" render={() => (
				<MainLayout>
					<Galleries />
				</MainLayout>
			)} />
			<Route path="/galleries/:filters" render={() => (
				<MainLayout>
					<Galleries />
				</MainLayout>
			)} />
			<Route path="/nft/:id" render={() => (
				<MainLayout>
					<NFTDetails />
				</MainLayout>
			)} />
			<Route path="/recovery" render={() => (
				<MainLayout>
					<Recovery />
				</MainLayout>
			)} />
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
)

export default App
