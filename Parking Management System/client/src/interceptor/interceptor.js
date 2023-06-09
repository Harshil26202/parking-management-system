import axios from 'axios'

const httpInterceptor = () => {
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      config.headers.Authorization = `Bearer ${token}`
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )
}
export default httpInterceptor
