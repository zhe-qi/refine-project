import type { AuthProvider } from '@refinedev/core'
import {
  authLoginUsingPost,
  authLogoutUsingPost,
  authPermissionsUsingGet,
  authUserinfoUsingGet,
} from '@/api/admin'
import { clearToken, getToken, isTokenExpired, setToken } from '@/utils/authUtils'

// 缓存变量和防并发处理
let cachedIdentity: any = null
let cachedPermissions: any = null
let cachedAuthCheck: { authenticated: boolean, timestamp: number } | null = null
let identityCacheTime = 0
let permissionsCacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存
const AUTH_CHECK_CACHE_DURATION = 30 * 1000 // 30秒认证状态缓存

// 防止并发请求
let permissionsPromise: Promise<any> | null = null
let identityPromise: Promise<any> | null = null
let authCheckPromise: Promise<any> | null = null

// 缓存管理工具函数
function clearAllCache() {
  cachedIdentity = null
  cachedPermissions = null
  cachedAuthCheck = null
  identityCacheTime = 0
  permissionsCacheTime = 0
  permissionsPromise = null
  identityPromise = null
  authCheckPromise = null
}

function isCacheValid(cacheTime: number, duration: number = CACHE_DURATION): boolean {
  return cacheTime > 0 && (Date.now() - cacheTime) < duration
}

export const authProvider: AuthProvider = {
  login: async ({ username, password, captchaToken }) => {
    try {
      const response = await authLoginUsingPost({
        body: { username, password, captchaToken },
      })

      const accessToken = response.data.accessToken
      setToken(accessToken)

      // 清除缓存和正在进行的请求
      clearAllCache()

      return {
        success: true,
        redirectTo: '/',
      }
    }
    catch (error: any) {
      // 登录失败时清除token，防止后续API调用触发token刷新循环
      clearToken()

      // 清除缓存和正在进行的请求
      clearAllCache()

      return {
        success: false,
        error: {
          name: 'LoginError',
          message: error?.response?.data?.message || 'Invalid credentials',
        },
      }
    }
  },

  logout: async () => {
    try {
      await authLogoutUsingPost({})
      clearToken()

      // 清除缓存和正在进行的请求
      clearAllCache()

      return { success: true, redirectTo: '/login' }
    }
    catch {
      clearToken()

      // 清除缓存和正在进行的请求
      clearAllCache()

      return { success: true, redirectTo: '/login' }
    }
  },

  check: async () => {
    const token = getToken()
    if (!token) {
      return { authenticated: false, redirectTo: '/login' }
    }

    // 首先检查token是否格式正确且未过期
    if (isTokenExpired(token)) {
      clearToken()
      cachedAuthCheck = null
      return { authenticated: false, redirectTo: '/login' }
    }

    // 检查缓存的认证状态
    const now = Date.now()
    if (cachedAuthCheck && (now - cachedAuthCheck.timestamp) < AUTH_CHECK_CACHE_DURATION) {
      return { authenticated: cachedAuthCheck.authenticated }
    }

    // 防止并发的认证检查请求
    if (authCheckPromise) {
      return authCheckPromise
    }

    authCheckPromise = (async () => {
      try {
        // 可选：如果需要服务器端验证，可以调用一个轻量级的验证接口
        // 这里我们主要依赖客户端JWT验证以提高性能
        const result = { authenticated: true }

        // 缓存认证结果
        cachedAuthCheck = {
          authenticated: result.authenticated,
          timestamp: Date.now(),
        }

        authCheckPromise = null
        return result
      }
      catch {
        // 如果服务器验证失败，清除令牌
        clearToken()
        cachedAuthCheck = { authenticated: false, timestamp: Date.now() }
        authCheckPromise = null
        return { authenticated: false, redirectTo: '/login' }
      }
    })()

    return authCheckPromise
  },

  getIdentity: async () => {
    const token = getToken()
    if (!token) {
      return null
    }

    // 检查缓存是否有效
    if (cachedIdentity && isCacheValid(identityCacheTime)) {
      return cachedIdentity
    }

    // 防止并发请求
    if (identityPromise) {
      return identityPromise
    }

    identityPromise = (async () => {
      try {
        const response = await authUserinfoUsingGet({})
        const userInfo = response.data

        const identity = {
          id: userInfo.id,
          name: userInfo.nickName || userInfo.username,
          username: userInfo.username,
          avatar: userInfo.avatar,
          roles: userInfo.roles || [],
        }

        // 缓存结果
        cachedIdentity = identity
        identityCacheTime = Date.now()
        identityPromise = null

        return identity
      }
      catch {
        identityPromise = null
        return null
      }
    })()

    return identityPromise
  },

  getPermissions: async () => {
    const token = getToken()
    if (!token) {
      return null
    }

    // 检查缓存是否有效
    if (cachedPermissions && isCacheValid(permissionsCacheTime)) {
      return cachedPermissions
    }

    // 防止并发请求
    if (permissionsPromise) {
      return permissionsPromise
    }

    permissionsPromise = (async () => {
      try {
        const response = await authPermissionsUsingGet({})
        const permissions = response.data

        // 缓存结果
        cachedPermissions = permissions
        permissionsCacheTime = Date.now()
        permissionsPromise = null

        return permissions
      }
      catch {
        permissionsPromise = null
        return null
      }
    })()

    return permissionsPromise
  },

  onError: async (error) => {
    console.error('auth error:', error)

    // 处理401认证错误
    if (error?.response?.status === 401 || error?.status === 401) {
      // 清除所有认证相关缓存
      clearToken()
      clearAllCache()

      return {
        logout: true,
        redirectTo: '/login',
        error: new Error('认证已过期，请重新登录'),
      }
    }

    return { error }
  },
}

export function getAccessToken() {
  return getToken()
}
