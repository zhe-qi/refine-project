import type { AuthProvider } from '@refinedev/core'
import type { paths } from '@/api/admin'
import { tryit } from 'radashi'
import { fetchClinet } from '@/api'
import { clearToken, getToken, isTokenValid, setToken } from '@/utils/auth'
import { clearEnforcer } from './access-control'

type UserIdentity = paths['/api/admin/auth/userinfo']['get']['responses']['200']['content']['application/json']['data']

// ==================== 缓存配置 ====================

const IDENTITY_CACHE_KEY = 'auth:identity'
const PERMISSIONS_CACHE_KEY = 'auth:permissions'

// 内存中的加载状态（防并发）
const loadingStates: {
  identity: Promise<UserIdentity | null> | null
  permissions: Promise<string[] | null> | null
} = {
  identity: null,
  permissions: null,
}

// 获取用户信息的核心函数
async function fetchUserIdentity(): Promise<UserIdentity | null> {
  const token = getToken()
  if (!token) {
    return null
  }

  const [err, response] = await tryit(fetchClinet.GET)('/api/admin/auth/userinfo', {})

  if (err || response?.error) {
    return null
  }

  const userInfo = response?.data?.data
  if (!userInfo) {
    return null
  }

  return userInfo
}

type Permissions = paths['/api/admin/auth/permissions']['get']['responses']['200']['content']['application/json']['data']

// 获取权限的核心函数
async function fetchPermissions(): Promise<Permissions['permissions'] | null> {
  const token = getToken()
  if (!token) {
    return null
  }

  const [err, response] = await tryit(fetchClinet.GET)('/api/admin/auth/permissions', {})

  if (err || response?.error) {
    return null
  }

  return response?.data?.data?.permissions || null
}

// 带缓存和防并发的获取用户信息
async function getCachedUserIdentity(): Promise<UserIdentity | null> {
  // 检查 sessionStorage 缓存
  const cached = sessionStorage.getItem(IDENTITY_CACHE_KEY)
  if (cached) {
    return JSON.parse(cached).data as UserIdentity
  }

  // 如果正在加载，等待并返回
  if (loadingStates.identity) {
    return loadingStates.identity
  }

  // 开始新的请求
  loadingStates.identity = (async () => {
    try {
      const data = await fetchUserIdentity()
      if (data) {
        sessionStorage.setItem(IDENTITY_CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now(),
        }))
      }
      loadingStates.identity = null
      return data
    }
    catch {
      loadingStates.identity = null
      return null
    }
  })()

  return loadingStates.identity
}

// 带缓存和防并发的获取权限
async function getCachedPermissions(): Promise<string[] | null> {
  // 检查 sessionStorage 缓存
  const cached = sessionStorage.getItem(PERMISSIONS_CACHE_KEY)
  if (cached) {
    return JSON.parse(cached).data as Permissions['permissions']
  }

  // 如果正在加载，等待并返回
  if (loadingStates.permissions) {
    return loadingStates.permissions
  }

  // 开始新的请求
  loadingStates.permissions = (async () => {
    try {
      const data = await fetchPermissions()
      if (data) {
        sessionStorage.setItem(PERMISSIONS_CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now(),
        }))
      }
      loadingStates.permissions = null
      return data
    }
    catch {
      loadingStates.permissions = null
      return null
    }
  })()

  return loadingStates.permissions
}

// ==================== 缓存清除 ====================

/**
 * 清除所有认证相关的缓存
 */
export function clearAuthCache() {
  // 清除 sessionStorage 中的缓存
  sessionStorage.removeItem(IDENTITY_CACHE_KEY)
  sessionStorage.removeItem(PERMISSIONS_CACHE_KEY)

  // 清除内存中的加载状态
  loadingStates.identity = null
  loadingStates.permissions = null
}

// 监听 token 变化事件，自动清除缓存
if (typeof window !== 'undefined') {
  window.addEventListener('auth:token-updated', clearAuthCache)
  window.addEventListener('auth:token-cleared', clearAuthCache)
}

// ==================== Auth Provider ====================

type LoginParams = paths['/api/admin/auth/login']['post']['requestBody']['content']['application/json']

export const authProvider: AuthProvider = {
  /**
   * 登录
   */
  login: async ({ username, password, captchaToken }: LoginParams) => {
    const [err, response] = await tryit(fetchClinet.POST)('/api/admin/auth/login', {
      body: {
        username,
        password,
        captchaToken,
      },
    })

    if (err || response?.error) {
      return {
        success: false,
        error: {
          name: '登录失败',
          message: err?.message || '用户名或密码错误',
        },
      }
    }

    const accessToken = response?.data?.data?.accessToken
    if (accessToken) {
      setToken(accessToken)
      // 清除旧缓存，准备获取新用户信息
      clearAuthCache()
    }

    return {
      success: true,
      redirectTo: '/',
    }
  },

  /**
   * 登出
   */
  logout: async () => {
    // 调用登出 API
    await tryit(fetchClinet.POST)('/api/admin/auth/logout', {})

    // 清除 token 和所有缓存
    clearToken()
    clearAuthCache()
    clearEnforcer() // 清除权限 enforcer

    return {
      success: true,
      redirectTo: '/login',
    }
  },

  /**
   * 检查认证状态
   */
  check: async () => {
    const token = getToken()

    // 没有 token 或 token 无效
    if (!token || !isTokenValid()) {
      return {
        authenticated: false,
        redirectTo: '/login',
        error: {
          name: '未认证',
          message: '请先登录',
        },
      }
    }

    // 有有效 token
    return {
      authenticated: true,
    }
  },

  /**
   * 获取用户信息（带缓存，自动防并发）
   */
  getIdentity: async () => {
    return getCachedUserIdentity()
  },

  /**
   * 获取用户权限（带缓存，自动防并发）
   */
  getPermissions: async () => {
    return getCachedPermissions()
  },

  /**
   * 错误处理
   */
  onError: async (error) => {
    // 处理 401 认证错误
    if (error?.response?.status === 401 || error?.status === 401) {
      // 清除所有认证相关数据和缓存
      clearToken()
      clearAuthCache()
      clearEnforcer() // 清除权限 enforcer

      return {
        logout: true,
        redirectTo: '/login',
        error: {
          message: '认证已过期，请重新登录',
          name: '认证失败',
        },
      }
    }

    // 其他错误直接返回
    return { error }
  },
}
