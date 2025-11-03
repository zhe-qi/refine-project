import type { Middleware } from 'openapi-fetch'
import type { paths as AdminPaths } from './admin'
import type { paths as PublicPaths } from './public'

import createFetchClient from 'openapi-fetch'
import createClient from 'openapi-react-query'

import { clearAuthAndRedirect, getToken, setToken } from '@/utils/auth'

const { VITE_APP_BASEURL } = import.meta.env

// Token 刷新状态管理
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: Promise<Response>) => void
  reject: (reason?: unknown) => void
  request: Request
}> = []

const authMiddleware: Middleware = {
  async onRequest({ request }) {
    // 如果请求 URL 包含登录或刷新接口，跳过添加 token
    const url = request.url
    if (url.includes('/auth/login') || url.includes('/auth/refresh')) {
      return request
    }

    const token = getToken()
    if (token && token !== 'null' && token !== 'undefined') {
      // 使用真实的 token 而非硬编码
      request.headers.set('Authorization', `Bearer ${token}`)
    }
    return request
  },
  async onResponse({ request, response }) {
    // 只处理 401 错误
    if (response.status !== 401) {
      return response
    }

    // 登录接口的 401 错误，不进行 token 刷新，直接返回
    if (request.url.includes('/auth/login')) {
      return response
    }

    // 如果正在刷新 token，将请求加入队列
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, request })
      })
    }

    // 开始刷新 token
    isRefreshing = true

    try {
      // 调用刷新 token 接口
      const refreshResponse = await fetch(`${VITE_APP_BASEURL}/api/admin/auth/refresh`, {
        method: 'POST',
        credentials: 'include', // 携带 cookie 中的 refresh token
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!refreshResponse.ok) {
        throw new Error('Token refresh failed')
      }

      const refreshData = await refreshResponse.json()
      const newAccessToken = refreshData.data.accessToken

      // 保存新的 access token
      setToken(newAccessToken)

      // 处理队列中的所有请求
      failedQueue.forEach(({ resolve, request: queuedRequest }) => {
        // 为队列中的请求添加新 token
        queuedRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)
        // 重新发起请求
        resolve(fetch(queuedRequest))
      })

      failedQueue = []

      // 重试原始请求
      const newRequest = request.clone()
      newRequest.headers.set('Authorization', `Bearer ${newAccessToken}`)
      return fetch(newRequest)
    }
    catch (error) {
      // 刷新 token 失败，清除所有认证信息并跳转登录
      failedQueue.forEach(({ reject }) => reject(error))
      failedQueue = []
      clearAuthAndRedirect()
      throw error
    }
    finally {
      isRefreshing = false
    }
  },
}

export const fetchClinet = createFetchClient<AdminPaths & PublicPaths>(
  {
    baseUrl: VITE_APP_BASEURL,
  },
)

fetchClinet.use(authMiddleware)

export const $api = createClient(fetchClinet)
