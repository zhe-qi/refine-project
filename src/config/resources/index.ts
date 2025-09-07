import type {
  GlobalConfig,
  Permission,
  ResourceDefinition,
  ResourceMeta,
  TransformedResources,
} from './types'
import { defineResources } from '../transformers'
import { systemResources } from './system'

// 导出类型
export type {
  GlobalConfig,
  Permission,
  ResourceDefinition,
  ResourceMeta,
  TransformedResources,
}

// 合并所有模块的资源
const allResources: ResourceDefinition[] = [
  ...systemResources,
  // 未来可以添加其他模块：
  // ...businessResources,
  // ...reportResources,
]

// 全局配置
const globalConfig: GlobalConfig = {
  apiPrefix: 'admin',
  defaultResource: 'users',
  defaults: {
    meta: {
      canDelete: true,
    },
  },
}

// 转换资源为多种格式
const transformedResources = defineResources(allResources, globalConfig)

// 导出转换后的资源
export const {
  refineResources,
  apiResources,
  permissionResources,
  routeResources,
  staticRoutes,
} = transformedResources

// 为了兼容性，也导出 refineCompatibleResources
export const refineCompatibleResources = refineResources

// 导出 resources 作为默认的资源配置（用于 App.tsx）
export const resources = refineResources

// 导出原始资源（用于权限管理等场景）
export { systemResources }

/**
 * 获取所有资源名称
 */
export function getAllResourceNames(): string[] {
  return refineResources.map(resource => resource.name)
}

/**
 * 获取资源配置
 */
export function getResourceConfig(name: string) {
  return refineResources.find(resource => resource.name === name)
}

/**
 * 权限项接口（用于权限分配）
 */
export interface PermissionItem {
  key: string // 唯一标识，如 "/system/users:GET"
  title: string // 显示名称
  resource: string // Casbin 资源路径
  method: string // HTTP 方法
  action: string // 操作类型
  category: string // 菜单名称
  categoryKey: string // 菜单标识
  parentCategory?: string // 父目录名称
  parentCategoryKey?: string // 父目录标识
}

/**
 * 获取所有可分配的权限
 */
export function getAllPermissions(): PermissionItem[] {
  const permissions: PermissionItem[] = []

  allResources.forEach((resource) => {
    // 跳过父级菜单资源
    if (!resource.permissions || resource.permissions.length === 0) {
      return
    }

    const categoryName = resource.meta?.label || resource.name
    const categoryKey = resource.name

    // 获取父目录信息
    let parentCategory: string | undefined
    let parentCategoryKey: string | undefined

    if (resource.meta?.parent) {
      const parentResource = allResources.find(r => r.name === resource.meta?.parent)
      if (parentResource) {
        parentCategory = parentResource.meta?.label || parentResource.name
        parentCategoryKey = parentResource.name
      }
    }

    // 添加权限项
    resource.permissions.forEach((perm) => {
      permissions.push({
        key: `${perm.path}:${perm.method}`,
        title: perm.title,
        resource: perm.path,
        method: perm.method,
        action: perm.action,
        category: categoryName,
        categoryKey,
        parentCategory,
        parentCategoryKey,
      })
    })
  })

  return permissions
}

/**
 * 简化的 API 路径获取函数
 */
export function getSimpleApiPath(
  resourceName: string,
  action: string,
  options: { id?: string | number } = {},
): string {
  const resource = apiResources.find(r => r.name === resourceName)
  if (!resource) {
    throw new Error(`Resource "${resourceName}" not found`)
  }

  switch (action) {
    case 'list':
    case 'create':
      return resource.apiBase
    case 'show':
    case 'edit':
    case 'delete':
      if (!options.id) {
        throw new Error(`ID is required for action "${action}"`)
      }
      return `${resource.apiBase}/${options.id}`
    default:
      return resource.apiBase
  }
}

/**
 * 获取批量操作路径
 */
export function getBulkApiPath(resourceName: string): string {
  const resource = apiResources.find(r => r.name === resourceName)
  if (!resource) {
    throw new Error(`Resource "${resourceName}" not found`)
  }

  return resource.apiBulk || `${resource.apiBase}/bulk`
}

/**
 * 获取权限路径
 */
export function getPermissionPath(
  resourceName: string,
  action: string,
  options: { id?: string | number } = {},
): { path: string, method: string } {
  const resource = permissionResources.find(r => r.name === resourceName)
  if (!resource) {
    throw new Error(`Resource "${resourceName}" not found`)
  }

  let path = resource.permissionBase
  const method = resource.methods?.[action] || 'GET'

  // 处理带 ID 的路径
  if (['show', 'edit', 'delete'].includes(action) && options.id) {
    path = `${path}/${options.id}`
  }

  // 处理自定义操作
  const originalResource = allResources.find(r => r.name === resourceName)
  const customPermission = originalResource?.permissions?.find(p => p.action === action)
  if (customPermission) {
    path = customPermission.path.replace('{id}', String(options.id || ''))
    return { path, method: customPermission.method }
  }

  return { path, method }
}
