// Libraries
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Components
import API from 'api'

class Invites extends Component {
  constructor (props) {
    super(props)

    this.data = {
      title: 'Invites · Coyote Bot',
      invites: []
    }
    this.state = { ...this.data }
  }

  // --------------------------------------------------------------------------
  // Obtiene la lista de intents antes de montar el componente
  // --------------------------------------------------------------------------
  componentDidMount () {
    API.Invites.List().then(response => {
      if (response.errors) {
        return window.alert('Hubo un problema al cargar invitaciones')
      }

      this.setState({ invites: response.data })
    })
  }

  // --------------------------------------------------------------------------
  // Renderiza una lista de invites.
  // --------------------------------------------------------------------------
  renderInvites () {
    if (this.state.invites.length > 0) {
      let body = this.state.invites.map(function (invite, index) {
        return (
          <Link
            key={index}
            className='box column is-4'
            to={`/invites/${invite.id}`}
          >
            {invite.template}
          </Link>
        )
      })

      return body
    }
    return <div className='notification'>No hay invites disponibles</div>
  }

  render () {
    return (
      <div>
        <h1>Home</h1>
        {this.renderInvites()}
      </div>
    )
  }
}

export default Invites
