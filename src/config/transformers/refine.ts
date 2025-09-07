import type { Permission, RefineResource, ResourceDefinition } from '../resources/types'

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
      case 'create':
        routes.create = `${perm.path}/create`
        break
      case 'edit':
        routes.edit = `${perm.path.replace('{id}', ':id')}/edit`
        break
      case 'show':
        routes.show = `${perm.path.replace('{id}', ':id')}/show`
        break
      case 'clone':
        routes.clone = `${perm.path.replace('{id}', ':id')}/clone`
        break
    }
  })

  // 如果没有 edit/show 路径但有 list 路径，自动生成
  if (routes.list && !routes.edit) {
    const basePath = routes.list
    routes.edit = `${basePath}/edit/:id`
  }
  if (routes.list && !routes.show) {
    const basePath = routes.list
    routes.show = `${basePath}/show/:id`
  }

  return routes
}

/**
 * 转换为 Refine 资源格式
 */
export function transformToRefineResources(
  resources: ResourceDefinition[],
  _apiPrefix: string = 'admin',
): RefineResource[] {
  return resources.map((resource) => {
    const { name, permissions, meta } = resource

    // 父级菜单资源
    if (!permissions || permissions.length === 0) {
      return {
        name,
        meta,
      } as RefineResource
    }

    // 从权限配置中提取路由
    const routes = extractRoutesFromPermissions(permissions)

    return {
      name,
      ...routes,
      meta,
    } as RefineResource
  })
}
