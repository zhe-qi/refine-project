import type { Permission, PermissionResource, ResourceDefinition } from '../resources/types'

/**
 * 从权限配置中提取权限基础路径
 */
function extractPermissionBase(permissions: Permission[]): string {
  // 优先使用 list 操作的路径作为基础路径
  const listPermission = permissions.find(p => p.action === 'list')
  if (listPermission) {
    return listPermission.path
  }

  // 如果没有 list，使用第一个权限的路径（去掉参数部分）
  if (permissions.length > 0) {
    return permissions[0].path
      .replace(/\{[^}]+\}.*$/, '') // 移除参数部分
      .replace(/\/[^/]+$/, '') // 移除最后一段路径
  }

  return ''
}

/**
 * 构建 HTTP 方法映射
 */
function buildMethodsMap(permissions: Permission[]): Record<string, string> {
  const methods: Record<string, string> = {}

  permissions.forEach((perm) => {
    methods[perm.action] = perm.method
  })

  return methods
}

/**
 * 转换为权限资源格式
 */
export function transformToPermissionResources(
  resources: ResourceDefinition[],
): PermissionResource[] {
  return resources
    .filter(resource => resource.permissions && resource.permissions.length > 0)
    .map((resource) => {
      const { name, permissions } = resource
      const permissionBase = extractPermissionBase(permissions!)
      const methods = buildMethodsMap(permissions!)

      return {
        name,
        permissionBase,
        methods,
      }
    })
}
