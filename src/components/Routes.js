// Libraries
import React from 'react'
import createBrowserHistory from 'history/createBrowserHistory'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

// Components
import Invites from './views/invites/'
import Invite from './views/invites/view/'

// create the browser history object
const browserHistory = createBrowserHistory()

// the AppRoutes component
const AppRoutes = () => (
  <BrowserRouter history={browserHistory}>
    <Switch>
      <Route path='/invites/:id' component={Invite} />
      <Route path='/' component={Invites} />
    </Switch>
  </BrowserRouter>
)

export default AppRoutes
