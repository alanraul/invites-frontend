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

  openModal (e) {
    document.getElementById('add-image').classList.add('is-active')
  }

  closeModal (e) {
    document.getElementById('add-image').classList.remove('is-active')
  }

  renderModal () {
    return (
      <div className='modal' id='add-image'>
        <div
          className='modal-background'
          onClick={this.closeModal.bind(this)}
        />
        <div className='modal-card'>
          <header className='modal-card-head'>
            <p className='modal-card-title'>Modal title</p>
            <button
              className='delete'
              aria-label='close'
              onClick={this.closeModal.bind(this)}
            />
          </header>
          <section className='modal-card-body'>
            <input className='input' type='text' placeholder='Text input' />
          </section>
          <footer className='modal-card-foot'>
            <button className='button is-success'>Crear</button>
            <button className='button' onClick={this.closeModal.bind(this)}>
              Cancel
            </button>
          </footer>
        </div>
      </div>
    )
  }

  render () {
    return (
      <div className='container'>
        <div className='columns is-multiline is-gapless'>
          <div className='column is-12 has-text-right'>
            <button
              className='button is-info is-medium is-outlined is-rounded'
              onClick={this.openModal.bind(this)}
            >
              +
            </button>
          </div>
          <br />
          <br />
          <br />
          {this.renderInvites()}
        </div>
        {this.renderModal()}
      </div>
    )
  }
}

export default Invites
