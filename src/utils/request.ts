import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

let url = ''

// 判断环境变量
const isDevelopment = import.meta.env.MODE === 'development'

if (isDevelopment) {
  // 开发环境走 Vite 代理
  url = '/api'
} else {
  // 生产环境后端地址从 .env 的 VITE_API_BASE_URL 读取（构建时注入）
  url = import.meta.env.VITE_API_BASE_URL
}

const requests = axios.create({
  baseURL: url,
  timeout: 8000,
  withCredentials: true
})

// 请求拦截器
requests.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：返回 res.data 而非完整 axios 响应
requests.interceptors.response.use(
  (res) => {
    return res.data
  },
  (error) => {
    console.error('请求错误:', error.message)
    return Promise.reject(error)
  }
)

/**
 * 类型安全的请求封装。
 * 响应拦截器已剥离 axios 包装，因此返回类型为 T 而非 AxiosResponse<T>。
 */
function request<T = unknown>(config: AxiosRequestConfig): Promise<T> {
  return requests(config) as Promise<T>
}

export default request
