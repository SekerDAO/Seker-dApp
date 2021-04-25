import { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { auth, handleUserProfile } from './firebase/utils'

import MainLayout from './layouts/MainLayout'
import HomepageLayout from './layouts/HomepageLayout'

import Homepage from './pages/Homepage'
import Learn from './pages/Learn'
import Login from './pages/Login'
import Galleries from './pages/Galleries'
import './default.scss'

const initialState = {
  currentUser: null
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ...initialState
    }
  }

  authListener = null

  componentDidMount() {
    this.authListener = auth.onAuthStateChanged(async userAuth => {

      if(userAuth) {
        const userRef = await handleUserProfile(userAuth)
        userRef.onSnapshot(snapshot => {
          this.setState({
            currentUser: {
              id: snapshot.id,
              ...snapshot.data()
            }
          })
        })
      }
      this.setState({
        ...initialState
      })
    })
  }

  componentWillUnmount() {
    this.authListener()
  }

  render() {
    const { currentUser } = this.state

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
          </Switch>
      </div>
    )
  }
}

export default App;
