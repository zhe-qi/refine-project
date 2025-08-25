import type { AuthProvider } from '@refinedev/core'
import {
  authLoginUsingPost,
  authLogoutUsingPost,
  authPermissionsUsingGet,
  authUserinfoUsingGet,
} from '@/api/admin'
import { clearToken, getToken, setToken } from '@/utils/authUtils'

// 缓存变量和防并发处理
let cachedIdentity: any = null
let cachedPermissions: any = null
let identityCacheTime = 0
let permissionsCacheTime = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

// 防止并发请求
let permissionsPromise: Promise<any> | null = null
let identityPromise: Promise<any> | null = null

// 缓存管理工具函数
function clearAllCache() {
  cachedIdentity = null
  cachedPermissions = null
  identityCacheTime = 0
  permissionsCacheTime = 0
  permissionsPromise = null
  identityPromise = null
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

    // 有有效token就认为已认证
    return { authenticated: true }
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
