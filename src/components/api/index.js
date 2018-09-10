// Librerías
import queryString from 'query-string'
import _isEmpty from 'lodash/isEmpty'

const API_PREFIX = '/api/v1'

const handleServerErrors = response => {
  if (response.ok) return response
  switch (response.status) {
    case 404:
      throw Object.create({ error: 'No se encontró el elemento solicitado' })
    case 401:
      break
    case 500:
      throw Object.create({ error: 'Error del servidor' })
  }
  // response.errors.detail es la forma estándar en la que el API regresa el mensaje de error
  return response.json().then(r => {
    throw r.errors.detail
  })
}

// Make the actual request
const request = async (method, endpoint, queryArray, body) => {
  if (_isEmpty(endpoint)) return
  const query = !_isEmpty(queryArray)
    ? `?${queryString.stringify(queryArray)}`
    : ''
  const url = process.env.API_SERVER + API_PREFIX + endpoint + query
  const fetchParams = {
    method,
    headers: {
      'content-type': 'application/json'
    }
  }
  if (body) Object.assign(fetchParams, { body: JSON.stringify(body) })
  if (process.env.DEBUG) console.info('myRequest', url, fetchParams)
  // Call the API and return a json response
  try {
    const response = await window
      .fetch(url, fetchParams)
      .then(handleServerErrors)
      .then(response => {
        if (response.status === 204) return null
        return response.json().then(json => {
          if (process.env.DEBUG) {
            console.log(`${method}: ${endpoint}${query}`, json)
          }
          return json
        })
      })
    return response
  } catch (error) {
    throw error
  }
}

// HTTP GET
function Get (route, params = {}) {
  return request('GET', route, params, null)
}
function Post (route, query, params, data) {
  return request('POST', route, query, data)
}
function Put (route, query, params, data) {
  return request('PUT', route, query, data)
}

// Exported functions
class Invites {
  static List (data) {
    return Get('/invites', data)
  }

  static Show (id) {
    return Get('/invites/' + id, {}, null)
  }

  static Create (data) {
    return Post('/invites', {}, '', data)
  }
}

class Texts {
  static Update (inviteId, id, data) {
    return Put('/invites/' + inviteId + '/texts/' + id, {}, '', data)
  }

  static Create (id, data) {
    return Post('/invites/' + id + '/texts', {}, '', data)
  }
}

export default { Invites, Texts }
