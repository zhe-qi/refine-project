import type { ResourceAction, ComponentConfig, ComponentImport } from '@/types/resource'

/**
 * 根据路由路径自动生成组件导入函数
 */
export function createComponentsFromRoute(
  routeConfig: {
    list?: string | import('./resourcePath').PathConfig
    create?: string | import('./resourcePath').PathConfig
    edit?: string | import('./resourcePath').PathConfig
    show?: string | import('./resourcePath').PathConfig
    clone?: string | import('./resourcePath').PathConfig
  },
  basePagePath: string = '../pages'
): ComponentConfig {
  const components: ComponentConfig = {}

  // 简化的直接映射策略
  const actionMap: Record<ResourceAction, string> = {
    list: 'list',
    create: 'create', 
    edit: 'edit',
    show: 'show',
    clone: 'clone',
  }

  Object.entries(routeConfig).forEach(([action, routePath]) => {
    if (routePath) {
      // 处理 PathConfig 或 string 类型
      const pathString = typeof routePath === 'string' ? routePath : routePath.base
      
      // 从路径中提取组件路径
      // 例如 '/system/users/:id/show' -> 'system/users'
      let cleanPath = pathString.replace(/^\/+/, '') // 移除开头斜杠
      cleanPath = cleanPath.replace(/\/:[^/]+(\/|$)/g, '/') // 移除所有路由参数 /:id
      cleanPath = cleanPath.replace(/\/$/, '') // 移除末尾斜杠
      
      // 移除操作路径后缀（如果存在）
      const actionSuffixes = ['create', 'edit', 'show', 'clone']
      const lastSegment = cleanPath.split('/').pop()
      if (lastSegment && actionSuffixes.includes(lastSegment)) {
        cleanPath = cleanPath.replace(`/${lastSegment}`, '')
      }
      
      const actionSuffix = actionMap[action as ResourceAction]
      const componentPath = `../pages/${cleanPath}/${actionSuffix}.tsx`
      
      // 创建动态导入函数，处理命名导出
      components[action as ResourceAction] = () => import(/* @vite-ignore */ componentPath)
        .then(module => {
          // 尝试获取默认导出，如果没有则尝试找到匹配的命名导出
          if (module.default) {
            return module
          }
          
          // 调试：显示模块的所有导出
          console.log(`[Debug] Imports from ${componentPath}:`, Object.keys(module))
          
          // 根据路径生成期望的组件名称
          // 例如：system/users/list -> UserList
          const pathParts = cleanPath.split('/')
          const resourceName = pathParts[pathParts.length - 1] // 获取最后一部分如 'users'
          const capitalizedResource = resourceName.charAt(0).toUpperCase() + resourceName.slice(1) // Users
          const capitalizedAction = actionSuffix.charAt(0).toUpperCase() + actionSuffix.slice(1) // List
          const expectedComponentName = `${capitalizedResource}${capitalizedAction}` // UsersList
          
          // 根据实际组件命名规范生成名称
          // 实际组件名为: UserList, UserCreate, UserEdit, UserShow, RoleList, etc.
          const singularResource = resourceName.endsWith('s') ? resourceName.slice(0, -1) : resourceName
          const capitalizedSingular = singularResource.charAt(0).toUpperCase() + singularResource.slice(1)
          const correctComponentName = `${capitalizedSingular}${capitalizedAction}`
          
          const possibleNames = [
            correctComponentName, // UserList, UserCreate, etc. 
            expectedComponentName, // 备用
            capitalizedAction, // List
          ]
          
          console.log(`[Debug] Looking for component names:`, possibleNames)
          
          for (const name of possibleNames) {
            if (module[name]) {
              console.log(`✅ Found component: ${name} in ${componentPath}`)
              return { default: module[name] }
            }
          }
          
          // 如果都没找到，返回第一个可用的导出
          const exports = Object.keys(module).filter(key => typeof module[key] === 'function')
          if (exports.length > 0) {
            return { default: module[exports[0]] }
          }
          
          throw new Error(`No suitable component export found in ${componentPath}`)
        })
        .catch(error => {
          console.error(`Failed to load component: ${componentPath}`, error)
          return { default: () => null } // 返回空组件作为fallback
        })
    }
  })

  return components
}


/**
 * 批量创建组件映射
 */
export function createComponentsMap(
  resources: Array<{
    name: string
    routes: {
      list?: string
      create?: string
      edit?: string
      show?: string
      clone?: string
    }
  }>,
  basePagePath: string = '../pages'
): Record<string, ComponentConfig> {
  const componentsMap: Record<string, ComponentConfig> = {}
  
  resources.forEach(resource => {
    componentsMap[resource.name] = createComponentsFromRoute(resource.routes, basePagePath)
  })
  
  return componentsMap
}

/**
 * 验证组件路径是否存在（开发时使用）
 */
export function validateComponentPaths(
  componentConfig: ComponentConfig,
  resourceName: string
): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  
  Object.entries(componentConfig).forEach(([action, importFn]) => {
    if (importFn) {
      // 在开发环境下可以尝试预加载来验证路径
      if (process.env.NODE_ENV === 'development') {
        importFn().catch(error => {
          errors.push(`Component not found for resource "${resourceName}" action "${action}": ${error.message}`)
        })
      }
    }
  })
  
  return {
    valid: errors.length === 0,
    errors
  }
}