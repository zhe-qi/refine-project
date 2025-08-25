import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { clearToken, getToken, setToken } from '@/utils/authUtils'
import { handleError } from '@/utils/errorHandler'

const { VITE_APP_BASEURL } = import.meta.env

class HttpClient {
  private axiosInstance = axios.create({
    baseURL: VITE_APP_BASEURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true, // 携带 Cookie（refresh token）
  })

  // 刷新 token 相关变量
  private isRefreshing = false
  private failedQueue: { resolve: (token: string) => void, config: AxiosRequestConfig }[] = []

  constructor() {
    this.setupInterceptors()
  }

  // 清除所有认证信息并跳转登录
  private clearAuthAndRedirect() {
    // 清除access token
    clearToken()

    // 清除所有cookie（包括refresh token）
    document.cookie.split(';').forEach((cookie) => {
      const eqPos = cookie.indexOf('=')
      const name = eqPos > -1 ? cookie.substring(0, eqPos).trim() : cookie.trim()
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`
    })

    // 清除localStorage
    localStorage.clear()

    // 跳转到登录页
    window.location.href = '/login'
  }

  // 设置拦截器
  private setupInterceptors() {
    // 请求拦截器：附加 Access Token
    this.axiosInstance.interceptors.request.use((config) => {
      // 如果设置了skipAuth，则不添加token
      if (config.headers?.skipAuth) {
        delete config.headers.skipAuth
        return config
      }

      const token = getToken()
      if (token && token !== 'null' && token !== 'undefined') {
        // 检查token是否即将过期，但不在请求拦截器中清除token
        // 让响应拦截器处理token刷新逻辑
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // 响应拦截器：处理token刷新
    this.axiosInstance.interceptors.response.use(
      response => response,
      async error => this.handleResponseError(error),
    )
  }

  // 处理响应错误 - 修复Promise类型错误
  private async handleResponseError(error: any): Promise<AxiosResponse | never> {
    const originalRequest = error.config

    // 已经重试过 or 非 401，直接抛出
    if (error.response?.status !== 401 || originalRequest._retry) {
      return handleError(error)
    }

    // 登录接口401错误，不进行token刷新，直接抛出
    if (originalRequest.url?.includes('/auth/login')) {
      return handleError(error)
    }

    // 如果正在刷新token，加入队列等待
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.failedQueue.push({ resolve, config: originalRequest })
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`
        return this.axiosInstance(originalRequest)
      })
    }

    // 标记为已重试，避免无限循环
    originalRequest._retry = true
    this.isRefreshing = true

    try {
      // 尝试刷新token
      const { data } = await axios.post(
        `${VITE_APP_BASEURL}/api/admin/auth/refresh`,
        {},
        { withCredentials: true },
      )
      const newAccessToken = data.data.accessToken

      // 保存新的access token
      setToken(newAccessToken)

      // 处理队列中的请求
      this.failedQueue.forEach(({ resolve }) => resolve(newAccessToken))
      this.failedQueue = []

      // 重试原始请求
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
      return this.axiosInstance(originalRequest)
    }
    catch (error) {
      // 刷新token失败，说明refresh token也过期了，清除所有认证信息并跳转登录
      this.failedQueue.forEach(({ resolve }) => resolve(''))
      this.failedQueue = []
      this.clearAuthAndRedirect()
      return handleError(error)
    }
    finally {
      this.isRefreshing = false
    }
  }

  // 构建请求配置
  private buildRequestConfig(url: string, options: CustomRequestOptions = {}): AxiosRequestConfig {
    const {
      skipAuth = false,
      timeout = 10000,
      method = 'GET',
      params,
      data,
      headers = {},
    } = options

    // 如果需要跳过认证，添加标记
    if (skipAuth) {
      headers.skipAuth = 'true'
    }

    return {
      url,
      method,
      params,
      data,
      headers,
      timeout,
    }
  }

  // 通用请求方法 - 修复不必要的try/catch
  async request<T>(url: string, options: CustomRequestOptions = {}): Promise<T> {
    const config = this.buildRequestConfig(url, options)
    const response = await this.axiosInstance(config)
    return response.data as T
  }

  // GET请求
  get<T>(url: string, options?: Omit<CustomRequestOptions, 'method'>) {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  // POST请求
  post<T>(url: string, data?: any, options?: Omit<CustomRequestOptions, 'method' | 'data'>) {
    return this.request<T>(url, { ...options, method: 'POST', data })
  }

  // PUT请求
  put<T>(url: string, data?: any, options?: Omit<CustomRequestOptions, 'method' | 'data'>) {
    return this.request<T>(url, { ...options, method: 'PUT', data })
  }

  // DELETE请求
  delete<T>(url: string, options?: Omit<CustomRequestOptions, 'method'>) {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }

  // PATCH请求
  patch<T>(url: string, data?: any, options?: Omit<CustomRequestOptions, 'method' | 'data'>) {
    return this.request<T>(url, { ...options, method: 'PATCH', data })
  }
}

// 创建HttpClient实例
const httpClient = new HttpClient()

// 导出request函数供openapi-ts-request使用
export function request<T>(url: string, options: CustomRequestOptions = {}): Promise<T> {
  return httpClient.request<T>(url, options)
}

// 导出httpClient实例供直接调用
export default httpClient
