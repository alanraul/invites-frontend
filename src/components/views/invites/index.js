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

  onChangeAddInput (e) {
    console.log(e.target)
  }

  // --------------------------------------------------------------------------
  // Renderiza una lista de invites.
  // --------------------------------------------------------------------------
  renderInvites () {
    if (this.state.invites.length > 0) {
      let body = this.state.invites.map(function (invite, index) {
        console.log(invite)
        console.log(process.env.API_SERVER)
        return (
          <Link
            key={index}
            className='box column is-4 has-text-centered'
            to={`/invites/${invite.id}`}
          >
            <img
              src={process.env.TEMPLATES_BUCKET + invite.template}
              width='40%'
            />
          </Link>
        )
      })
      return body
    }
    return <div className='notification'>No hay invites disponibles</div>
  }

  render () {
    return (
      <div className='container'>
        <h1 className='title is-1'>Invitaciones</h1>
        <div class='columns is-multiline is-gapless'>
          {this.renderInvites()}
        </div>
      </div>
    )
  }
}

export default Invites
