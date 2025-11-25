import type { AccessControlProvider } from '@refinedev/core'
import type { paths } from '@/api/admin'
import { Enforcer, newModel, StringAdapter } from 'casbin'
import { authProvider } from './auth-provider'

type UserIdentity = paths['/api/admin/auth/userinfo']['get']['responses']['200']['content']['application/json']['data']
type Permissions = paths['/api/admin/auth/permissions']['get']['responses']['200']['content']['application/json']['data']

export const casbinModel = newModel(`
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

let enforcerInstance: Enforcer | null = null
let enforcerLoading: Promise<Enforcer> | null = null

export async function getEnforcer(): Promise<Enforcer> {
  // 如果已有实例，直接返回
  if (enforcerInstance) {
    return enforcerInstance
  }

  // 如果正在加载，等待加载完成
  if (enforcerLoading) {
    return enforcerLoading
  }

  // 开始加载权限并创建enforcer
  enforcerLoading = (async () => {
    try {
      // 从 authProvider 缓存获取权限（会等待权限加载完成）
      const permissionsData = await authProvider.getPermissions?.() as Permissions | null
      if (!permissionsData || !permissionsData.permissions || permissionsData.permissions.length === 0) {
        throw new Error('获取权限失败')
      }

      // 合并 permissions 和 groupings 为 Casbin 策略格式
      const policies = [
        ...permissionsData.permissions,
        ...permissionsData.groupings,
      ].join('\n')

      // 创建 Enforcer
      const adapter = new StringAdapter(policies)
      const enforcer = new Enforcer()
      await enforcer.initWithModelAndAdapter(casbinModel, adapter)
      enforcerInstance = enforcer

      return enforcerInstance
    }
    finally {
      enforcerLoading = null
    }
  })()

  return enforcerLoading
}

// 清除 enforcer 实例（用于登出或token refresh时）
export function clearEnforcer() {
  enforcerInstance = null
  enforcerLoading = null
}

export const accessControlProvider: AccessControlProvider = {
  can: async ({ resource, action, params }) => {
    try {
      const enforcer = await getEnforcer()

      // 直接从 authProvider 缓存获取用户信息
      const identity = await authProvider.getIdentity?.() as UserIdentity | null
      if (!identity?.roles || identity.roles.length === 0) {
        return {
          can: false,
          reason: '未找到用户角色信息',
        }
      }

      const roles = identity.roles

      let resourcePath = null
      let method = null

      switch (action) {
        case 'list':
          resourcePath = `/${resource}`
          method = 'GET'
          break
        case 'create':
          resourcePath = `/${resource}`
          method = 'POST'
          break
        case 'edit':
          resourcePath = `/${resource}/{id}`
          method = 'PATCH'
          break
        case 'show':
          resourcePath = `/${resource}/{id}`
          method = 'GET'
          break
        case 'delete':
          resourcePath = `/${resource}/{id}`
          method = 'DELETE'
          break
        default:
        // 从 resource meta 读取自定义 action 配置
        {
          const customAction = params?.resource?.meta?.customActions?.[action]
          if (customAction) {
            resourcePath = customAction.path
            method = customAction.method
          }
          break
        }
      }

      if (!resourcePath || !method) {
        return {
          can: false,
          reason: '未定义的操作',
        }
      }

      // 检查是否有任何角色拥有该权限
      for (const role of roles) {
        const allowed = await enforcer.enforce(role, resourcePath, method)
        if (allowed) {
          return { can: true }
        }
      }

      return {
        can: false,
        reason: '您没有权限执行此操作',
      }
    }
    catch (error) {
      console.error('权限检查失败:', error)
      return {
        can: false,
        reason: '权限检查失败',
      }
    }
  },

  options: {
    buttons: {
      enableAccessControl: true,
      hideIfUnauthorized: true,
    },
  },
}
