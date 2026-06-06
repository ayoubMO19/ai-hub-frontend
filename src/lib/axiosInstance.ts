import axios from 'axios'
import { API_URL } from './constants'

const axiosInstance = axios.create({
  baseURL: API_URL,
})

axiosInstance.interceptors.request.use((config) => {
  const stored = localStorage.getItem('auth-storage')
  if (stored) {
    try {
      const parsed = JSON.parse(stored)
      const token = parsed?.state?.token
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch {}
  }
  return config
})

export default axiosInstance
