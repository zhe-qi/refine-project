import type { AccessControlProvider, CanParams, CanReturnType } from '@refinedev/core'
import { newEnforcer, newModel, StringAdapter } from 'casbin'
import { refineResources } from '@/config/resources'
import { getPermissionPath } from '@/utils/resourcePath'
import { authProvider } from './authProvider'

// 权限检查结果缓存
interface PermissionCacheEntry {
  result: CanReturnType
  timestamp: number
}

const permissionCache = new Map<string, PermissionCacheEntry>()
const CACHE_DURATION = 5 * 60 * 1000 // 5分钟缓存

// Casbin enforcer 缓存
let cachedEnforcer: any = null
let enforcerPermissionsHash: string = ''

// 防止并发的权限检查
const ongoingChecks = new Map<string, Promise<CanReturnType>>()

// 生成稳定的缓存键，只使用核心属性
function generateCacheKey(resource: string, action: string, params?: any): string {
  // 只使用资源名称，忽略其他可变属性
  const resourceName = resource
  const paramsKey = params?.id ? `_${params.id}` : ''
  return `${resourceName}_${action}${paramsKey}`
}

export const model = newModel(`
[request_definition]
r = sub, obj, act

[policy_definition]
p = sub, obj, act, eft

[role_definition]
g = _, _

[policy_effect]
e = some(where (p.eft == allow)) && !some(where (p.eft == deny))

[matchers]
m = g(r.sub, p.sub) && keyMatch3(r.obj, p.obj) && regexMatch(r.act, p.act)
`)

/**
 * 构建权限请求对象
 * 使用新的路径解析系统
 */
function buildRequestObject(resource: string, action: string, params?: any): { path: string, method: string } {
  try {
    // 特殊处理父级菜单资源
    const resourceConfig = refineResources.find(r => r.name === resource)
    if (resourceConfig && !resourceConfig.paths) {
      // 父级菜单资源没有实际权限控制，直接允许访问
      return {
        path: `/${resource}`,
        method: 'GET',
      }
    }

    // 特殊处理角色相关的动作
    if (resource === 'users' && (action === 'addRole' || action === 'removeRole')) {
      const method = action === 'addRole' ? 'POST' : 'DELETE'
      const path = params?.id ? `/system/users/${params.id}/roles` : '/system/users/roles'
      return { path, method }
    }

    // 使用新的路径工具获取权限路径
    const resolved = getPermissionPath(refineResources, resource, action as any, {
      params: params?.id ? { id: params.id } : undefined,
    })

    // 处理字段级权限
    if (action === 'field' && params?.field) {
      const baseResolved = getPermissionPath(refineResources, resource, 'list', {})
      const fieldResult = {
        path: `${baseResolved.path}/${params.field}`,
        method: baseResolved.method,
      }
      return fieldResult
    }

    return {
      path: resolved.path,
      method: resolved.method,
    }
  }
  catch (error: any) {
    console.warn('❌ [权限调试] 构建权限请求对象失败:', { resource, action, params, error: error?.message })
    // 回退到默认行为
    const fallbackResult = {
      path: `/${resource}${params?.id ? `/${params.id}` : ''}`,
      method: 'GET',
    }
    return fallbackResult
  }
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }: CanParams): Promise<CanReturnType> => {
    // 生成稳定的缓存键
    const cacheKey = generateCacheKey(resource!, action!, params)

    // 检查缓存
    const now = Date.now()
    const cached = permissionCache.get(cacheKey)
    if (cached && (now - cached.timestamp) < CACHE_DURATION) {
      return cached.result
    }

    // 检查是否有正在进行的相同权限检查
    const ongoingCheck = ongoingChecks.get(cacheKey)
    if (ongoingCheck) {
      return ongoingCheck
    }

    // 开始新的权限检查
    const checkPromise = (async (): Promise<CanReturnType> => {
      try {
        // 特殊处理父级菜单资源
        const resourceConfig = refineResources.find(r => r.name === resource)
        if (resourceConfig && !resourceConfig.paths) {
          // 父级菜单资源（如 'system'）通常只需要用户已登录即可访问
          // 这里可以根据具体需求调整权限逻辑
          const result = { can: true }
          permissionCache.set(cacheKey, { result, timestamp: now })
          return result
        }

        // 获取用户权限
        const permissions = await authProvider.getPermissions?.()

        if (!permissions || !Array.isArray(permissions)) {
          const result = { can: false }
          permissionCache.set(cacheKey, { result, timestamp: now })
          return result
        }

        // 解析权限数据 - 现在直接是Casbin策略字符串
        const policyLines = permissions.filter((line: string) => line.trim().length > 0)

        if (policyLines.length === 0) {
          const result = { can: false }
          permissionCache.set(cacheKey, { result, timestamp: now })
          return result
        }

        // 构建请求对象
        const { path: requestPath, method: requestMethod } = buildRequestObject(resource!, action!, params)

        // 获取用户信息以获取角色
        const userIdentity = await authProvider.getIdentity?.()
        const { roles: userRoles, id: userId } = userIdentity as { roles: string[], id: string }

        if (userRoles.length === 0) {
          const result = { can: false }
          permissionCache.set(cacheKey, { result, timestamp: now })
          return result
        }

        // 构建角色映射策略：g, 用户ID, 角色
        const roleMappings = userRoles.map((role: string) => `g, ${userId}, ${role}`)

        // 构建完整的策略字符串：角色映射 + 权限策略
        const allLines = [...roleMappings, ...policyLines]
        const policyString = allLines.join('\n')

        // 检查是否需要重建 enforcer
        const permissionsHash = JSON.stringify(permissions)

        if (!cachedEnforcer || enforcerPermissionsHash !== permissionsHash) {
          // 创建新的适配器和执行器
          const adapter = new StringAdapter(policyString)
          cachedEnforcer = await newEnforcer(model, adapter)
          enforcerPermissionsHash = permissionsHash
        }

        // 执行权限检查，使用解析后的路径和方法
        const can = await cachedEnforcer.enforce(userId, requestPath, requestMethod)
        const result = { can }

        // 缓存结果
        permissionCache.set(cacheKey, { result, timestamp: Date.now() })

        return result
      }
      catch (error) {
        console.error('❌ Access control error:', error)
        const result = { can: false }
        // 即使出错也要缓存结果，避免重复尝试
        permissionCache.set(cacheKey, { result, timestamp: Date.now() })
        return result
      }
      finally {
        // 清除正在进行的检查
        ongoingChecks.delete(cacheKey)
      }
    })()

    // 记录正在进行的检查
    ongoingChecks.set(cacheKey, checkPromise)

    return checkPromise
  },
}
