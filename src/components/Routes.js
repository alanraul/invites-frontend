// Libraries
import React from 'react'
import createBrowserHistory from 'history/createBrowserHistory'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

// Components
import Invites from './views/invites/'
import Invite from './views/invites/view/'

import Topbar from 'shared/topbar'

// create the browser history object
const browserHistory = createBrowserHistory()

// the AppRoutes component
const AppRoutes = () => (
  <div>
    <Topbar />
    <section className='section'>
      <BrowserRouter history={browserHistory}>
        <Switch>
          <Route path='/invites/:id' component={Invite} />
          <Route path='/' component={Invites} />
        </Switch>
      </BrowserRouter>
    </section>
  </div>
)

export default AppRoutes
