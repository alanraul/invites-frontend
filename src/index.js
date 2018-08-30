// Libraries
import React from 'react'
import { render } from 'react-dom'

// Components
import Routes from './components/Routes'

// Se importa el CSS principal para que se parsee el archivo en webpack
import './css/index.scss'

render(<Routes />, document.getElementById('app'))
