import axios from 'axios'
import has from 'lodash/has'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'

// axios.defaults.headers.post['Content-Type'] = 'application/json';

const baseURL = 'https://api.staging.b81.io/api'
const client = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

const ClientApi = async (url, _options = {}) => {
  try {
    let options = cloneDeep({ headers: {}, ..._options, url })
    let params = options.params || null

    if (params && params.perPage) {
      params.$limit = params.perPage
      delete params.perPage
    }

    if (params && params.page && params.$limit) {
      params.$skip = (params.page - 1) * params.$limit
      delete params.page
    }

    if (options.token) {
      options.headers.Authorization = `Bearer ${options.token}`
    }

    if (!options.method) {
      options = { ...options, method: 'get' }
    }

    const response = await client.request(options)
    if (response.data.data && !Array.isArray(response.data.data)) {
      return response.data.data
    }

    // Paging params
    if (has(response, 'data.skip') && has(response, 'data.limit') && has(response, 'data.total')) {
      const { skip, limit, total } = response.data

      response.data.page = Math.ceil(skip / limit + 1)
      response.data.perPage = limit
      response.data.totalPages = Math.ceil(total / limit)
    }

    return response.data
  } catch (error) {
    // TODO: Error handling / custom errors
    console.log('ERROR', error)
    if (error.response) {
      // Request was made, server responded with status != 2xx
      console.log(error.response)
      console.log(error.response.status)
      // console.log(error.response.headers);
    } else if (error.request) {
      // Request made but no response received
      // `error.request`: instance of XMLHttpRequest in the browser,
      // instance http.ClientRequest in node
      console.log('[API CLIENT] Request made but no response received')
      console.log(error.message)

      // console.log(error.request);
    } else {
      // No request made
      // console.log('Error', error.message);
      console.log('API CLIENT (No request made)', error.message)
    }

    throw error
  }
}

export default ClientApi
