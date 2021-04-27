import { Component } from 'react'
import { connect } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { auth, handleUserProfile } from './firebase/utils'
import { setCurrentUser } from './redux/User/user.actions'
 
import MainLayout from './layouts/MainLayout'
import HomepageLayout from './layouts/HomepageLayout'

import Homepage from './pages/Homepage'
import Learn from './pages/Learn'
import Login from './pages/Login'
import Registration from './pages/Registration'
import Galleries from './pages/Galleries'
import Recovery from './pages/Recovery'
import './default.scss'

class App extends Component {

  authListener = null

  componentDidMount() {
    const { setCurrentUser } = this.props
    this.authListener = auth.onAuthStateChanged(async userAuth => {

      if(userAuth) {
        const userRef = await handleUserProfile(userAuth)
        userRef.onSnapshot(snapshot => {
          setCurrentUser({
            id: snapshot.id,
            ...snapshot.data()
          })
        })
      }
      setCurrentUser(userAuth)
    })
  }

  componentWillUnmount() {
    this.authListener()
  }

  render() {
    const { currentUser } = this.props

    return (
      <div className="App">
          <Switch>
            <Route exact path="/" render={() => (
              <HomepageLayout currentUser={currentUser}>
                <Homepage />
              </HomepageLayout>  
            )} />
            <Route path="/learn" render={() => (
              <MainLayout currentUser={currentUser}>
                <Learn />
              </MainLayout>  
            )} />
            <Route path="/registration" 
              render={() => currentUser? <Redirect to="/" /> : (
                <MainLayout currentUser={currentUser}>
                  <Registration />
                </MainLayout>  
            )} />
            <Route path="/login" 
              render={() => currentUser? <Redirect to="/" /> : (
                <MainLayout currentUser={currentUser}>
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
          </Switch>
      </div>
    )
  }
}

const mapStateToProps = ({ user }) => ({
  currentUser: user.currentUser
})

const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);
