import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { auth, handleUserProfile } from './firebase/utils'
import { setCurrentUser } from './redux/User/user.actions'

// hoc
import WithAuth from './hoc/WithAuth'
 
import MainLayout from './layouts/MainLayout'
import HomepageLayout from './layouts/HomepageLayout'

import Homepage from './pages/Homepage'
import Learn from './pages/Learn'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Galleries from './pages/Galleries'
import Recovery from './pages/Recovery'
import Dashboard from './pages/Dashboard'
import './default.scss'

const App = props => {
  const dispatch = useDispatch()

  useEffect(() => {
    const authListener = auth.onAuthStateChanged(async userAuth => {

      if(userAuth) {
        const userRef = await handleUserProfile(userAuth)
        userRef.onSnapshot(snapshot => {
          dispatch(setCurrentUser({
            id: snapshot.id,
            ...snapshot.data()
          }))
        })
      }
      dispatch(setCurrentUser(userAuth))
    })

    return () => {
      authListener()
    }
  }, [])

  return (
    <div className="App">
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
          <Route path="/galleries" render={() => (
            <MainLayout>
              <Galleries />
            </MainLayout>  
          )} />
          <Route path="/recovery" render={() => (
            <MainLayout>
              <Recovery />
            </MainLayout>  
          )} />
          <Route path="/dashboard" render={() => (
            <WithAuth>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </WithAuth>
          )} />
        </Switch>
    </div>
  )
}

export default App
