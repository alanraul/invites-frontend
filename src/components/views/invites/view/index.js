import React, { Component } from 'react'
import update from 'immutability-helper'

import API from 'api'

class Invite extends Component {
  constructor (props) {
    super(props)

    this.data = {
      title: 'Invites · Coyote Bot',
      invite: {
        id: null,
        template: null,
        texts: []
      }
    }
    this.state = { ...this.data }
  }

  // --------------------------------------------------------------------------
  // Obtiene la lista de intents antes de montar el componente
  // --------------------------------------------------------------------------
  componentDidMount () {
    API.Invites.Show(this.props.match.params.id).then(response => {
      if (response.errors) {
        return window.alert('Hubo un problema al cargar invitaciones')
      }

      this.setState({ invite: response.data })
    })
  }

  onChangeInput (index, key, e) {
    this.setState({
      invite: update(this.state.invite, {
        texts: { [index]: { [key]: { $set: e.target.value } } }
      })
    })
  }

  updateText (index, e) {
    const body = this.state.invite.texts[index]

    API.Texts.Update(this.state.invite.id, body.id, { text: body })
      .then(response => {
        this.setState({
          invite: update(this.state.invite, {
            texts: { [index]: { $set: response.data } }
          })
        })
      })
      .catch(e => {
        console.error(e)
        window.alert('Hubo un problema al cargar intents')
      })
  }

  renderTexts () {
    if (this.state.invite.texts.length > 0) {
      let body = this.state.invite.texts.map((text, index) => {
        return (
          <div className='columns is-multiline' key={index}>
            <div className='field column is-12 has-background-light'>
              <div className='columns is-multiline'>
                <div className='column is-8'>
                  <h2 className='title is-2 is-clipped'>{text.tag}</h2>
                </div>
                <div className='column is-4 has-text-right'>
                  <button
                    className='button'
                    onClick={this.updateText.bind(this, index)}
                  >
                    Actualizar
                  </button>
                </div>
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Color</label>
              <div className='control'>
                <input
                  className='input'
                  type='text'
                  onChange={this.onChangeInput.bind(this, index, 'color')}
                  value={text.color}
                />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Alineación</label>
              <div className='control'>
                <input
                  className='input'
                  type='text'
                  onChange={this.onChangeInput.bind(this, index, 'align')}
                  value={text.align}
                />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Fuente</label>
              <div className='control'>
                <input
                  className='input'
                  type='text'
                  onChange={this.onChangeInput.bind(this, index, 'font')}
                  value={text.font}
                />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Tamaño de fuente</label>
              <div className='control'>
                <input
                  className='input'
                  type='number'
                  onChange={this.onChangeInput.bind(this, index, 'size')}
                  value={text.size}
                />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Espacio entre parrafos</label>
              <div className='control'>
                <input
                  className='input'
                  type='number'
                  onChange={this.onChangeInput.bind(this, index, 'spacing')}
                  value={text.spacing}
                />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Ancho de columna</label>
              <div className='control'>
                <input
                  className='input'
                  type='number'
                  onChange={this.onChangeInput.bind(this, index, 'number_char')}
                  value={text.number_char}
                />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Coordenadas</label>
              <div className='control'>
                <input
                  className='input'
                  type='text'
                  onChange={this.onChangeInput.bind(this, index, 'coordinates')}
                  value={text.coordinates}
                />
              </div>
            </div>
          </div>
        )
      })
      return body
    }
    return <div className='notification'>No hay invites disponibles</div>
  }

  render () {
    return (
      <div className='container'>
        <h1 className='title is-1'>Template {this.state.invite.id}</h1>
        <div className='columns is-multiline'>
          <div className='column is-5 is-black'>
            <img
              src={process.env.TEMPLATES_BUCKET + this.state.invite.template}
              width='100%'
            />
          </div>
          <div className='column is-7'>{this.renderTexts()}</div>
        </div>
      </div>
    )
  }
}

export default Invite
