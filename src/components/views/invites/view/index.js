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
      },
      form: {
        tag: '',
        spacing: 10,
        size: 38,
        number_char: 20,
        font: 'Gotham-Book.otf',
        coordinates: '0,0',
        color: '#FFFFFF',
        align: 'center'
      },
      image: ''
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

      let image = process.env.TEMPLATES_BUCKET + response.data.template
      this.setState({ invite: response.data, image: image })
    })
  }

  createText (e) {
    let body = this.state.form
    body['invite_id'] = this.state.invite.id

    API.Texts.Create(this.state.invite.id, { text: this.state.form })
      .then(response => {
        let texts = this.state.invite.texts
        texts.push(response.data)

        this.setState({
          invite: update(this.state.form, {
            texts: { $set: texts }
          })
        })
      })
      .catch(e => {
        console.error(e)
        window.alert('Hubo un problema al crear el texto')
      })

    document.getElementById('add-image').classList.remove('is-active')
  }

  onChangeInput (index, key, e) {
    this.setState({
      invite: update(this.state.invite, {
        texts: { [index]: { [key]: { $set: e.target.value } } }
      })
    })
  }

  onChangeInputForm (e) {
    this.setState({
      form: update(this.state.form, {
        [e.target.name]: { $set: e.target.value }
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

        this.createMessage()
      })
      .catch(e => {
        console.error(e)
        window.alert('Hubo un problema al actualizar el texto')
      })
  }

  createMessage () {
    let body = {
      invite_id: this.state.invite.id,
      texts: [
        {
          text: 'DESPEDIDA DE SOLTERA',
          tag: 'event'
        },
        {
          text: 'LUZ OSMARA BLANCO REYNA',
          tag: 'celebrated'
        },
        {
          text:
            'CALZ. GRAL. MARIANO ESCOBEDO 555, POLANCO, POLANCO V SECC, 11580 CIUDAD DE MÉXICO, CDMX',
          tag: 'place'
        },
        {
          text: 'SÁBADO 6 DE JULIO A LAS 2:30 PM',
          tag: 'date'
        }
      ]
    }

    API.Messages.Create({ message: body })
      .then(response => {
        console.log(response)
        this.setState({ image: response.uri })
      })
      .catch(e => {
        console.error(e)
        window.alert('Hubo un problema al crear el texto')
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
            <div className='columns is-multiline'>
              <div className='field column is-6'>
                <label className='label'>Tag</label>
                <div className='control'>
                  <input
                    className='input'
                    type='text'
                    name='tag'
                    onChange={this.onChangeInputForm.bind(this)}
                    value={this.state.form.tag}
                  />
                </div>
              </div>

              <div className='field column is-6'>
                <label className='label'>Color</label>
                <div className='control'>
                  <input
                    className='input'
                    type='text'
                    name='color'
                    onChange={this.onChangeInputForm.bind(this)}
                    value={this.state.form.color}
                  />
                </div>
              </div>

              <div className='field column is-6'>
                <label className='label'>Alineación</label>
                <div className='control'>
                  <input
                    className='input'
                    type='text'
                    name='align'
                    onChange={this.onChangeInputForm.bind(this)}
                    value={this.state.form.align}
                  />
                </div>
              </div>

              <div className='field column is-6'>
                <label className='label'>Fuente</label>
                <div className='control'>
                  <input
                    className='input'
                    type='text'
                    name='font'
                    onChange={this.onChangeInputForm.bind(this)}
                    value={this.state.form.font}
                  />
                </div>
              </div>

              <div className='field column is-6'>
                <label className='label'>Tamaño de fuente</label>
                <div className='control'>
                  <input
                    className='input'
                    type='number'
                    name='size'
                    onChange={this.onChangeInputForm.bind(this)}
                    value={this.state.form.size}
                  />
                </div>
              </div>

              <div className='field column is-6'>
                <label className='label'>Espacio entre parrafos</label>
                <div className='control'>
                  <input
                    className='input'
                    type='number'
                    name='spacing'
                    onChange={this.onChangeInputForm.bind(this)}
                    value={this.state.form.spacing}
                  />
                </div>
              </div>

              <div className='field column is-6'>
                <label className='label'>Ancho de columna</label>
                <div className='control'>
                  <input
                    className='input'
                    type='number'
                    name='number_char'
                    onChange={this.onChangeInputForm.bind(this)}
                    value={this.state.form.number_char}
                  />
                </div>
              </div>

              <div className='field column is-6'>
                <label className='label'>Coordenadas</label>
                <div className='control'>
                  <input
                    className='input'
                    type='text'
                    name='coordinates'
                    onChange={this.onChangeInputForm.bind(this)}
                    value={this.state.form.coordinates}
                  />
                </div>
              </div>
            </div>
          </section>
          <footer className='modal-card-foot'>
            <button
              className='button is-success'
              onClick={this.createText.bind(this)}
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
        <div className='columns'>
          <div className='column is-7'>
            <h1 className='title is-1'>Template {this.state.invite.id}</h1>
          </div>
          <div className='column is-5 has-text-right'>
            <button
              className='button is-info is-medium is-outlined is-rounded'
              onClick={this.openModal.bind(this)}
            >
              +
            </button>
          </div>
        </div>

        <div className='columns is-multiline'>
          <div className='column is-5 is-black'>
            <img src={this.state.image} width='100%' />
          </div>
          <div className='column is-7'>{this.renderTexts()}</div>
        </div>

        {this.renderModal()}
      </div>
    )
  }
}

export default Invite
