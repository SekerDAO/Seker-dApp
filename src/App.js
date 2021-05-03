import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Switch, Route } from 'react-router-dom'
import { auth, handleUserProfile } from './firebase/utils'
import { checkUserSession } from './redux/User/user.actions'

// components
import AdminToolbar from './components/AdminToolbar'

// hoc
import WithAuth from './hoc/WithAuth'
import WithAdminAuth from './hoc/WithAdminAuth'
 
// layouts
import MainLayout from './layouts/MainLayout'
import HomepageLayout from './layouts/HomepageLayout'
import AdminLayout from './layouts/AdminLayout'
import DashboardLayout from './layouts/DashboardLayout'

// pages
import Homepage from './pages/Homepage'
import Learn from './pages/Learn'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Galleries from './pages/Galleries'
import Recovery from './pages/Recovery'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import NFTDetails from './pages/NFTDetails'
import './default.scss'

const App = props => {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(checkUserSession())

  }, [])

  return (
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
          <Route path="/galleries/:filterType" render={() => (
            <MainLayout>
              <Galleries />
            </MainLayout>  
          )} />
          <Route path="/nft/:nftID" render={() => (
            <MainLayout>
              <NFTDetails />
            </MainLayout>  
          )} />
          <Route path="/recovery" render={() => (
            <MainLayout>
              <Recovery />
            </MainLayout>  
          )} />
          <Route path="/dashboard" render={() => (
            <WithAuth>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </WithAuth>
          )} />
          <Route path="/admin" render={() => (
            <WithAdminAuth>
              <AdminLayout>
                <Admin />
              </AdminLayout>
            </WithAdminAuth>
          )} />
        </Switch>
    </div>
  )
}

export default App
