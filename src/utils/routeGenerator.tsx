import type { ReactElement } from 'react'
import type { ComponentConfig, ResourceAction } from '@/types/resource'
import { ErrorComponent } from '@refinedev/antd'
import { Spin } from 'antd'
import { lazy, Suspense } from 'react'
import { Route } from 'react-router'

/**
 * 静态路由资源接口
 */
interface StaticRoute {
  name: string
  path: string
  routes: {
    list?: string
    create?: string
    edit?: string
    show?: string
    clone?: string
  }
  components?: ComponentConfig
}

/**
 * 路由配置选项
 */
interface RouteGeneratorOptions {
  /** 加载中组件 */
  fallback?: ReactElement
  /** 错误组件 */
  errorComponent?: ReactElement
  /** 是否启用懒加载 */
  enableLazyLoading?: boolean
}

/**
 * 默认加载中组件
 */
const DefaultFallback = (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '200px',
  }}
  >
    <Spin size="large" />
  </div>
)

/**
 * 创建单个路由组件
 */
function createRouteComponent(
  resource: StaticRoute,
  action: ResourceAction,
  options: RouteGeneratorOptions = {},
): ReactElement {
  const {
    fallback = DefaultFallback,
    errorComponent = <ErrorComponent />,
    enableLazyLoading = true,
  } = options

  const componentImport = resource.components?.[action as keyof ComponentConfig]

  if (!componentImport) {
    console.warn(`Component not found for resource "${resource.name}" action "${action}"`)
    return errorComponent
  }

  // 创建懒加载组件
  const LazyComponent = lazy(componentImport)

  // 如果启用懒加载，使用 Suspense 包装
  if (enableLazyLoading) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent />
      </Suspense>
    )
  }

  return <LazyComponent />
}

/**
 * 生成单个资源的路由配置
 */
function generateResourceRoutes(
  resource: StaticRoute,
  options: RouteGeneratorOptions = {},
): ReactElement {
  const routes: ReactElement[] = []

  // 生成 index 路由 (list)
  if (resource.routes.list) {
    routes.push(
      <Route
        key={`${resource.name}-index`}
        index
        element={createRouteComponent(resource, 'list', options)}
      />,
    )
  }

  // 生成其他路由
  const actionRoutes: Array<{
    action: ResourceAction
    path: string
    routePath?: string
  }> = [
    { action: 'create', path: 'create', routePath: resource.routes.create },
    { action: 'edit', path: 'edit/:id', routePath: resource.routes.edit },
    { action: 'show', path: 'show/:id', routePath: resource.routes.show },
    { action: 'clone', path: 'clone/:id', routePath: resource.routes.clone },
  ]

  actionRoutes.forEach(({ action, path, routePath }) => {
    if (routePath) {
      routes.push(
        <Route
          key={`${resource.name}-${action}`}
          path={path}
          element={createRouteComponent(resource, action, options)}
        />,
      )
    }
  })

  return (
    <Route key={resource.name} path={resource.path}>
      {routes}
    </Route>
  )
}

/**
 * 生成所有路由配置
 */
export function generateRoutes(
  staticRoutes: StaticRoute[],
  options: RouteGeneratorOptions = {},
): ReactElement[] {
  return staticRoutes.map(resource =>
    generateResourceRoutes(resource, options),
  )
}

/**
 * 生成路由树结构（用于调试）
 */
export function getRouteTree(staticRoutes: StaticRoute[]): Record<string, any> {
  return staticRoutes.reduce((tree, resource) => {
    tree[resource.name] = {
      path: resource.path,
      routes: Object.entries(resource.routes)
        .filter(([, path]) => path)
        .reduce((routes, [action, path]) => {
          routes[action] = path
          return routes
        }, {} as Record<string, string>),
    }
    return tree
  }, {} as Record<string, any>)
}

/**
 * 验证路由配置
 */
export function validateRoutes(staticRoutes: StaticRoute[]): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  staticRoutes.forEach((resource) => {
    // 检查是否有至少一个路由
    const hasRoutes = Object.values(resource.routes).some(Boolean)
    if (!hasRoutes) {
      errors.push(`Resource "${resource.name}" has no routes defined`)
    }

    // 检查是否有 list 路由（通常是必需的）
    if (!resource.routes.list) {
      warnings.push(`Resource "${resource.name}" missing list route`)
    }

    // 检查组件是否存在
    Object.entries(resource.routes).forEach(([action, path]) => {
      if (path) {
        const componentImport = resource.components?.[action as keyof ComponentConfig]
        if (!componentImport) {
          errors.push(`Component not found for resource "${resource.name}" action "${action}"`)
        }
      }
    })

    // 检查路径格式
    if (!resource.path.startsWith('/')) {
      errors.push(`Resource "${resource.name}" path should start with "/"`)
    }
  })

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
