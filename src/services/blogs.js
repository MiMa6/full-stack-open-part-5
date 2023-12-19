import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = newBlogObject => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.post(baseUrl, newBlogObject, config)
  return request.then(response => response.data)
}

const update = (id, newBlogObject) => {
  const request = axios.put(`${baseUrl}/${id}`, newBlogObject)
  return request.then(response => response.data)
}

const del = (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const request = axios.delete(`${baseUrl}/${id}`, config)
  return request.then(response => response.data)
}

export default { getAll, create, setToken, update, del }