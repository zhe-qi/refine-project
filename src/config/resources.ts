import {
  apiResources,
  getAllResourceNames,
  permissionResources,
  refineCompatibleResources,
  refineResources,
  routeResources,
} from './modules'

// 导出不同格式的资源配置
export {
  apiResources,
  permissionResources,
  refineCompatibleResources,
  refineResources,
  routeResources,
}

// 为了保持向后兼容，也导出 resources 作为 refineCompatibleResources 的别名
export const resources = refineCompatibleResources

/**
 * 获取扩展资源配置的便捷函数
 */
export function getExtendedResource(name: string) {
  return refineResources.find(resource => resource.name === name)
}

/**
 * 获取所有资源名称（从模块中获取）
 */
export { getAllResourceNames as getResourceNames }

/**
 * 权限项接口
 */
export interface PermissionItem {
  key: string // 唯一标识，如 "/system/users:GET"
  title: string // 显示名称，如 "查看"（只显示操作名称）
  resource: string // Casbin 资源路径，如 "/system/users"
  method: string // HTTP 方法，如 "GET"
  action: string // 操作类型，如 "list"
  category: string // 菜单名称，如 "用户管理"
  categoryKey: string // 菜单标识，如 "users"
  parentCategory?: string // 父目录名称，如 "系统管理"
  parentCategoryKey?: string // 父目录标识，如 "system"
}

/**
 * 获取所有可分配的权限
 * 基于 resources 配置生成标准化的权限列表
 */
export function getAllPermissions(): PermissionItem[] {
  const permissions: PermissionItem[] = []

  // 操作到中文名称的映射
  const actionNameMap: Record<string, string> = {
    list: '查看',
    show: '详情',
    create: '创建',
    edit: '编辑',
    delete: '删除',
  }

  refineResources.forEach((resource) => {
    // 跳过父级菜单资源
    if (!resource.paths)
      return

    const categoryName = resource.meta?.label || resource.name
    const categoryKey = resource.name

    // 获取父目录信息
    let parentCategory: string | undefined
    let parentCategoryKey: string | undefined

    if (resource.meta?.parent) {
      const parentResource = refineResources.find(r => r.name === resource.meta?.parent)
      if (parentResource) {
        parentCategory = parentResource.meta?.label || parentResource.name
        parentCategoryKey = parentResource.name
      }
    }

    // 解析权限基础路径
    const resourcePath = typeof resource.paths.permission?.base === 'string'
      ? resource.paths.permission.base
      : resource.paths.permission?.base?.base || `/admin/${resource.name}`

    // 如果有权限配置，优先使用权限配置
    if (resource.permissions) {
      const { standard = [], custom = [] } = resource.permissions

      // 处理标准权限
      standard.forEach((action: string) => {
        const actionName = actionNameMap[action]
        if (!actionName)
          return

        // 根据操作类型决定是否需要 ID 参数
        const needsId = action === 'show' || action === 'edit' || action === 'delete'
        const finalPath = needsId ? `${resourcePath}/{id}` : resourcePath

        // 获取HTTP方法
        const method = getHttpMethodForAction(action)

        permissions.push({
          key: `${finalPath}:${method}`,
          title: actionName, // 只显示操作名称，如 "查看"
          resource: finalPath,
          method,
          action,
          category: categoryName,
          categoryKey,
          parentCategory,
          parentCategoryKey,
        })
      })

      // 处理自定义权限
      custom.forEach((customPerm: any) => {
        // 构建完整路径
        const fullPath = customPerm.path.startsWith('/')
          ? customPerm.path
          : `${resourcePath}/${customPerm.path.replace(/^\/+/, '')}`

        permissions.push({
          key: `${fullPath}:${customPerm.method}`,
          title: customPerm.title, // 直接使用自定义权限的标题
          resource: fullPath,
          method: customPerm.method,
          action: customPerm.action,
          category: categoryName,
          categoryKey,
          parentCategory,
          parentCategoryKey,
        })
      })
    }
    else {
      // 如果没有权限配置，回退到默认行为（标准权限）
      const standardActions: Array<keyof typeof actionNameMap> = ['list', 'show', 'create', 'edit', 'delete']

      standardActions.forEach((action) => {
        const actionName = actionNameMap[action]
        const needsId = action === 'show' || action === 'edit' || action === 'delete'
        const finalPath = needsId ? `${resourcePath}/{id}` : resourcePath
        const method = getHttpMethodForAction(action)

        permissions.push({
          key: `${finalPath}:${method}`,
          title: actionName, // 只显示操作名称
          resource: finalPath,
          method,
          action,
          category: categoryName,
          categoryKey,
          parentCategory,
          parentCategoryKey,
        })
      })

      // 处理自定义方法权限（保持向后兼容）
      if (resource.paths.permission?.methods) {
        Object.entries(resource.paths.permission.methods).forEach(([customAction, customMethod]) => {
          if (customMethod) {
            const finalPath = `${resourcePath}/{id}`

            permissions.push({
              key: `${finalPath}:${customMethod}`,
              title: customAction, // 使用操作名称
              resource: finalPath,
              method: customMethod,
              action: customAction,
              category: categoryName,
              categoryKey,
              parentCategory,
              parentCategoryKey,
            })
          }
        })
      }
    }
  })

  return permissions
}

/**
 * 获取操作对应的HTTP方法
 */
function getHttpMethodForAction(action: string): string {
  const methodMap: Record<string, string> = {
    list: 'GET',
    show: 'GET',
    create: 'POST',
    edit: 'PATCH',
    delete: 'DELETE',
  }
  return methodMap[action] || 'GET'
}

/**
 * 验证所有资源配置
 */
export function validateAllResources(): Record<string, string[]> {
  const validationResults: Record<string, string[]> = {}

  refineResources.forEach((resource) => {
    // 跳过父级菜单资源
    if (!resource.paths)
      return

    // 动态导入避免循环依赖
    import('@/utils/resourcePath').then(({ validateResourcePaths }) => {
      const errors = validateResourcePaths(resource)
      if (errors.length > 0) {
        validationResults[resource.name] = errors
        console.error(`❌ Resource "${resource.name}" validation errors:`, errors)
      }
      // 仅在开发模式下显示成功信息（通过检查是否有开发工具）
      else if (typeof window !== 'undefined' && (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__) {
        // eslint-disable-next-line no-console
        console.log(`✅ Resource "${resource.name}" validation passed`)
      }
    })
  })

  return validationResults
}
