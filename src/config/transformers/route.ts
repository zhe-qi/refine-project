import type { Permission, ResourceDefinition, RouteResource, StaticRoute } from '../resources/types'
import { createComponentsFromRoute } from '@/utils/componentMapper'

/**
 * 从权限配置中提取路由路径
 */
function extractRoutesFromPermissions(permissions: Permission[]): {
  list?: string
  create?: string
  edit?: string
  show?: string
  clone?: string
} {
  const routes: any = {}

  permissions.forEach((perm) => {
    switch (perm.action) {
      case 'list':
        routes.list = perm.path
        break
      case 'create': {
        // create 路由通常在 list 路径后加 /create
        const listPath = permissions.find(p => p.action === 'list')?.path || perm.path
        routes.create = `${listPath}/create`
        break
      }
      case 'edit':
        // 转换 {id} 为 :id
        routes.edit = perm.path.replace('{id}', ':id')
        if (!routes.edit.includes('/edit')) {
          routes.edit = `${routes.edit}/edit`
        }
        break
      case 'show':
        routes.show = perm.path.replace('{id}', ':id')
        if (!routes.show.includes('/show')) {
          routes.show = `${routes.show}/show`
        }
        break
      case 'clone':
        routes.clone = perm.path.replace('{id}', ':id')
        if (!routes.clone.includes('/clone')) {
          routes.clone = `${routes.clone}/clone`
        }
        break
    }
  })

  // 如果没有某些路由但有 list 路径，自动生成
  if (routes.list) {
    if (!routes.create) {
      routes.create = `${routes.list}/create`
    }
    if (!routes.edit) {
      routes.edit = `${routes.list}/edit/:id`
    }
    if (!routes.show) {
      routes.show = `${routes.list}/show/:id`
    }
  }

  return routes
}

/**
 * 转换为路由资源格式
 */
export function transformToRouteResources(
  resources: ResourceDefinition[],
): RouteResource[] {
  return resources
    .filter(resource => resource.permissions && resource.permissions.length > 0)
    .map((resource) => {
      const { name, permissions } = resource
      const routes = extractRoutesFromPermissions(permissions!)

      return {
        name,
        routes,
      }
    })
}

/**
 * 转换为静态路由格式
 */
export function transformToStaticRoutes(
  resources: ResourceDefinition[],
): StaticRoute[] {
  return resources
    .filter(resource => resource.permissions && resource.permissions.length > 0)
    .map((resource) => {
      const { name, permissions } = resource
      const routes = extractRoutesFromPermissions(permissions!)

      // 基础路径使用 list 路由
      const path = routes.list || `/${name}`

      // 自动生成组件映射
      const components = createComponentsFromRoute(routes)

      return {
        name,
        path,
        routes,
        components: components as Record<string, () => Promise<{ default: any }>>,
      }
    })
}
