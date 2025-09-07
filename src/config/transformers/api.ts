import type { ApiResource, Permission, ResourceDefinition } from '../resources/types'

/**
 * 从权限配置中提取 API 基础路径
 */
function extractApiBase(permissions: Permission[]): string {
  // 优先使用 list 操作的路径作为基础路径
  const listPermission = permissions.find(p => p.action === 'list')
  if (listPermission) {
    // 移除开头的斜杠
    return listPermission.path.replace(/^\/+/, '')
  }

  // 如果没有 list，使用第一个权限的路径
  if (permissions.length > 0) {
    const basePath = permissions[0].path
      .replace(/^\/+/, '') // 移除开头斜杠
      .replace(/\{[^}]+\}.*$/, '') // 移除参数部分
      .replace(/\/[^/]+$/, '') // 移除最后一段路径
    return basePath
  }

  return ''
}

/**
 * 转换为 API 资源格式
 */
export function transformToApiResources(
  resources: ResourceDefinition[],
  apiPrefix: string = 'admin',
): ApiResource[] {
  return resources
    .filter(resource => resource.permissions && resource.permissions.length > 0)
    .map((resource) => {
      const { name, permissions } = resource
      const apiBase = extractApiBase(permissions!)

      // 添加 API 前缀
      const fullApiBase = apiBase.startsWith(apiPrefix)
        ? apiBase
        : `${apiPrefix}/${apiBase}`

      return {
        name,
        apiBase: fullApiBase,
        apiBulk: `${fullApiBase}/bulk`,
      }
    })
}
