import React, { Component } from 'react'
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

  renderTexts () {
    if (this.state.invite.texts.length > 0) {
      let body = this.state.invite.texts.map(function (text, index) {
        console.log(text)
        return (
          <div className='columns is-multiline' key={index}>
            <div className='field column is-12 has-background-primary'>
              <div className='columns is-multiline'>
                <div className='column is-8'>
                  <h2 className='title is-2 is-clipped'>{text.tag}</h2>
                </div>
                <div className='column is-4 has-text-right'>
                  <button className='button'>Actualizar</button>
                </div>
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Color</label>
              <div className='control'>
                <input className='input' type='text' value={text.color} />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Alineación</label>
              <div className='control'>
                <input className='input' type='text' value={text.align} />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Fuente</label>
              <div className='control'>
                <input className='input' type='text' value={text.font} />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Tamaño de fuente</label>
              <div className='control'>
                <input className='input' type='number' value={text.size} />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Espacio entre parrafos</label>
              <div className='control'>
                <input className='input' type='number' value={text.spacing} />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Ancho de columna</label>
              <div className='control'>
                <input
                  className='input'
                  type='number'
                  value={text.number_char}
                />
              </div>
            </div>

            <div className='field column is-6'>
              <label className='label'>Coordenadas</label>
              <div className='control'>
                <input className='input' type='text' value={text.coordinates} />
              </div>
            </div>
          </div>
        )
      })
      return <div className=''>{body}</div>
    }
    return <div className='notification'>No hay invites disponibles</div>
  }

  render () {
    return (
      <div>
        <h1 className='title is-1'>Template {this.state.invite.id}</h1>
        <div className='columns is-multiline'>
          <div className='column is-4 is-black'>
            <img
              src={
                'https://s3.us-east-2.amazonaws.com/invites-templates/' +
                this.state.invite.template
              }
              width='80%'
            />
          </div>
          <div className='column is-6'>{this.renderTexts()}</div>
        </div>
      </div>
    )
  }
}

export default Invite
