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

// 权限缓存有效期（毫秒）- 24小时
const PERMISSIONS_CACHE_TTL = 24 * 60 * 60 * 1000

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
  // 检查 localStorage 缓存
  const cached = localStorage.getItem(IDENTITY_CACHE_KEY)
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
        localStorage.setItem(IDENTITY_CACHE_KEY, JSON.stringify({
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
// 使用 stale-while-revalidate 策略：先返回缓存，后台更新
async function getCachedPermissions(): Promise<string[] | null> {
  // 检查 localStorage 缓存
  const cached = localStorage.getItem(PERMISSIONS_CACHE_KEY)
  let cachedData: { data: string[], timestamp: number } | null = null

  if (cached) {
    try {
      cachedData = JSON.parse(cached)
      if (cachedData) {
        const age = Date.now() - cachedData.timestamp

        // 如果缓存未过期，立即返回缓存数据
        if (age < PERMISSIONS_CACHE_TTL) {
          // 同时在后台更新权限（不等待结果）
          refreshPermissionsInBackground()
          return cachedData.data
        }
      }
    } catch (error) {
      console.error('解析权限缓存失败:', error)
    }
  }

  // 如果没有缓存或缓存已过期，等待新的权限加载
  if (loadingStates.permissions) {
    return loadingStates.permissions
  }

  // 开始新的请求
  loadingStates.permissions = (async () => {
    try {
      const data = await fetchPermissions()
      if (data) {
        localStorage.setItem(PERMISSIONS_CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now(),
        }))
      }
      return data
    }
    catch (error) {
      console.error('获取权限失败:', error)
      // 如果有旧缓存，即使过期也返回
      return cachedData?.data || null
    }
    finally {
      loadingStates.permissions = null
    }
  })()

  return loadingStates.permissions
}

// 后台刷新权限（不阻塞）
function refreshPermissionsInBackground() {
  // 避免重复刷新
  if (loadingStates.permissions) {
    return
  }

  loadingStates.permissions = (async () => {
    try {
      const data = await fetchPermissions()
      if (data) {
        localStorage.setItem(PERMISSIONS_CACHE_KEY, JSON.stringify({
          data,
          timestamp: Date.now(),
        }))
        // 权限更新后，清除 enforcer 实例，强制重新初始化
        clearEnforcer()
      }
      return data
    }
    catch (error) {
      // 后台更新失败，静默处理
      console.warn('后台刷新权限失败:', error)
      return null
    }
    finally {
      loadingStates.permissions = null
    }
  })()
}

// ==================== 缓存清除 ====================

/**
 * 清除所有认证相关的缓存
 */
export function clearAuthCache() {
  // 清除用户身份缓存
  localStorage.removeItem(IDENTITY_CACHE_KEY)

  // Token refresh时不清除权限缓存
  // 权限缓存使用 localStorage，只在登出时清除
  loadingStates.identity = null

  // 不清除 loadingStates.permissions 和权限缓存
  // 这样可以保持权限数据的持久性
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
    // 登出时需要清除权限缓存
    localStorage.removeItem(PERMISSIONS_CACHE_KEY)
    loadingStates.permissions = null
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
      // 401错误时也需要清除权限缓存
      localStorage.removeItem(PERMISSIONS_CACHE_KEY)
      loadingStates.permissions = null
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
