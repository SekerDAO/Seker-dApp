import { Switch, Route } from 'react-router-dom'

import MainLayout from './layouts/MainLayout'
import HomepageLayout from './layouts/HomepageLayout'

import Homepage from './pages/Homepage'
import Learn from './pages/Learn'
import './default.scss'

function App() {
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
        </Switch>
    </div>
  )
}

export default App;
