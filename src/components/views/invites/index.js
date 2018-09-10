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
      invites: [],
      form: {
        template: ''
      }
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

  createImage (e) {
    API.Invites.Create({ invite: this.state.form }).then(response => {
      if (response.errors) {
        return window.alert('Hubo un problema al cargar invitaciones')
      }
      let invites = this.state.invites
      invites.push(response.data)

      this.setState({ invites: invites, form: { template: '' } })
    })
    document.getElementById('add-image').classList.remove('is-active')
  }

  onChangeInput (e) {
    this.setState({ form: { template: e.target.value } })
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
            <div className='field'>
              <label className='label'>Nombre de la imagen</label>
              <div className='control'>
                <input
                  className='input'
                  type='text'
                  onChange={this.onChangeInput.bind(this)}
                  value={this.state.form.template}
                  placeholder='00.png'
                />
              </div>
            </div>
          </section>
          <footer className='modal-card-foot'>
            <button
              className='button is-success'
              onClick={this.createImage.bind(this)}
            >
              Crear
            </button>
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
