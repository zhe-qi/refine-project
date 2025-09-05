import type {
  ExtendedResourceItem,
  PathConfig,
  PathMapping,
  PathResolveOptions,
  PathType,
  PermissionConfig,
  ResolvedPath,
  ResourceAction,
} from '@/types/resource'

/**
 * 默认HTTP方法映射
 */
const DEFAULT_HTTP_METHODS: Record<ResourceAction, string> = {
  list: 'GET',
  show: 'GET',
  create: 'POST',
  edit: 'PATCH',
  delete: 'DELETE',
  clone: 'GET',
}

/**
 * 简化的资源配置定义接口
 */
export interface ResourceConfig {
  /** 资源名称 */
  name: string
  /** 路径配置（对于父级菜单资源，此项为可选） */
  paths?: {
    /** 前端路由路径 */
    route: {
      list?: string | PathConfig
      create?: string | PathConfig
      edit?: string | PathConfig
      show?: string | PathConfig
      clone?: string | PathConfig
    }
    /** 后端API路径 */
    api?: {
      base?: string | PathConfig
      bulk?: string | PathConfig
    }
    /** 权限校验路径 */
    permission?: {
      base?: string | PathConfig
      methods?: Record<string, string>
    }
  }
  /** 权限配置 */
  permissions?: PermissionConfig
  /** 资源元数据 */
  meta?: ExtendedResourceItem['meta']
}

/**
 * 全局默认配置接口
 */
export interface GlobalDefaults {
  /** 默认权限配置 */
  permissions?: PermissionConfig
  /** 默认元数据配置 */
  meta?: ExtendedResourceItem['meta']
}

/**
 * 全局配置接口
 */
export interface GlobalConfig {
  /** 全局API前缀，默认为 'admin' */
  apiPrefix?: string
  /** 全局默认配置 */
  defaults?: GlobalDefaults
  /** 资源配置数组 */
  resources: ResourceConfig[]
}

/**
 * defineConfig 返回的多格式资源配置
 */
export interface ResourceConfigs {
  /** Refine 应用使用的标准格式 */
  refineResources: ExtendedResourceItem[]
  /** 转换为 Refine 兼容格式的资源 */
  refineCompatibleResources: any[]
  /** API 路径映射，用于 dataProvider */
  apiResources: Array<{
    name: string
    apiBase: string
    apiBulk?: string
  }>
  /** 权限资源映射，用于 accessControl */
  permissionResources: Array<{
    name: string
    permissionBase: string
    methods?: Record<string, string>
  }>
  /** 路由资源映射，用于路由配置 */
  routeResources: Array<{
    name: string
    routes: {
      list?: string
      create?: string
      edit?: string
      show?: string
      clone?: string
    }
  }>
}

/**
 * 从路由路径推导 API 和权限路径
 */
function derivePathsFromRoute(routeList: string): {
  apiBase: string
  permissionBase: string
} {
  // 移除开头的斜杠，作为 API 路径
  const apiBase = routeList.replace(/^\/+/, '')

  // 权限路径保持斜杠开头
  const permissionBase = routeList.startsWith('/') ? routeList : `/${routeList}`

  return { apiBase, permissionBase }
}

/**
 * 合并资源配置与全局默认配置
 */
function mergeResourceWithDefaults(
  resource: ResourceConfig,
  globalDefaults?: GlobalDefaults,
): ResourceConfig {
  if (!globalDefaults) {
    return resource
  }

  const merged: ResourceConfig = {
    ...resource,
    // 合并权限配置
    permissions: {
      // 继承全局默认的标准权限，如果资源没有明确定义的话
      standard: resource.permissions?.standard || globalDefaults.permissions?.standard,
      // 合并自定义权限（资源的自定义权限优先）
      custom: [
        ...(globalDefaults.permissions?.custom || []),
        ...(resource.permissions?.custom || []),
      ],
    },
    // 合并元数据配置（资源配置覆盖全局默认）
    meta: {
      ...globalDefaults.meta,
      ...resource.meta,
    },
  }

  // 如果合并后的权限配置是空的，移除它
  if (!merged.permissions?.standard?.length && !merged.permissions?.custom?.length) {
    delete merged.permissions
  }

  return merged
}

/**
 * 定义资源配置的函数
 * 返回多种格式的资源配置，适用于不同场景
 */
export function defineConfig(config: GlobalConfig): ResourceConfigs {
  const { apiPrefix = 'admin', defaults, resources } = config

  // 将全局默认配置与每个资源配置合并
  const mergedResources = resources.map(resource =>
    mergeResourceWithDefaults(resource, defaults),
  )

  const refineResources: ExtendedResourceItem[] = mergedResources.map((resource) => {
    const { name, paths, permissions, meta = {} } = resource

    // 对于父级菜单资源（没有 paths），直接返回
    if (!paths) {
      return {
        name,
        permissions,
        meta,
      } as ExtendedResourceItem
    }

    // 自动推导缺失的路径配置
    const finalPaths = { ...paths }

    // 如果没有配置 API 或权限路径，但有 route.list，则自动推导
    if (paths.route?.list && (!paths.api?.base || !paths.permission?.base)) {
      const routeListPath = typeof paths.route.list === 'string' ? paths.route.list : paths.route.list.base
      const derived = derivePathsFromRoute(routeListPath)

      // 如果没有配置 API 路径，使用推导的路径
      if (!paths.api?.base) {
        finalPaths.api = {
          ...paths.api,
          base: derived.apiBase,
        }
      }

      // 如果没有配置权限路径，使用推导的路径
      if (!paths.permission?.base) {
        finalPaths.permission = {
          ...paths.permission,
          base: derived.permissionBase,
        }
      }
    }

    // 确保必要的路径存在
    if (!finalPaths.api?.base) {
      throw new Error(`Resource "${name}" missing api.base and cannot derive from route.list`)
    }

    if (!finalPaths.permission?.base) {
      throw new Error(`Resource "${name}" missing permission.base and cannot derive from route.list`)
    }

    // 只处理 API 路径的前缀
    const processApiPath = (path: string | PathConfig): string | PathConfig => {
      if (typeof path === 'string') {
        return path.startsWith(apiPrefix)
          ? path
          : `${apiPrefix}/${path.replace(/^\/+/, '')}`
      }
      else {
        return {
          ...path,
          base: path.base.startsWith(apiPrefix)
            ? path.base
            : `${apiPrefix}/${path.base.replace(/^\/+/, '')}`,
        }
      }
    }

    const processedPaths = {
      ...finalPaths,
      api: {
        ...finalPaths.api,
        base: processApiPath(finalPaths.api!.base),
        ...(finalPaths.api!.bulk && {
          bulk: processApiPath(finalPaths.api!.bulk),
        }),
      },
    }

    return {
      name,
      paths: processedPaths as PathMapping,
      permissions,
      meta,
    } as ExtendedResourceItem
  })

  // 生成 API 资源映射
  const apiResources = refineResources
    .filter(resource => resource.paths) // 过滤掉没有 paths 的父级菜单资源
    .map(resource => ({
      name: resource.name,
      apiBase: typeof resource.paths!.api!.base === 'string'
        ? resource.paths!.api!.base
        : resource.paths!.api!.base.base,
      ...(resource.paths!.api!.bulk && {
        apiBulk: typeof resource.paths!.api!.bulk === 'string'
          ? resource.paths!.api!.bulk
          : resource.paths!.api!.bulk.base,
      }),
    }))

  // 生成权限资源映射
  const permissionResources = refineResources
    .filter(resource => resource.paths) // 过滤掉没有 paths 的父级菜单资源
    .map(resource => ({
      name: resource.name,
      permissionBase: typeof resource.paths!.permission!.base === 'string'
        ? resource.paths!.permission!.base
        : resource.paths!.permission!.base.base,
      ...(resource.paths!.permission!.methods && {
        methods: Object.fromEntries(
          Object.entries(resource.paths!.permission!.methods).filter(([, value]) => value !== undefined),
        ) as Record<string, string>,
      }),
    }))

  // 生成路由资源映射
  const routeResources = refineResources
    .filter(resource => resource.paths) // 过滤掉没有 paths 的父级菜单资源
    .map(resource => ({
      name: resource.name,
      routes: {
        list: typeof resource.paths!.route.list === 'string'
          ? resource.paths!.route.list
          : resource.paths!.route.list?.base,
        create: typeof resource.paths!.route.create === 'string'
          ? resource.paths!.route.create
          : resource.paths!.route.create?.base,
        edit: typeof resource.paths!.route.edit === 'string'
          ? resource.paths!.route.edit
          : resource.paths!.route.edit?.base,
        show: typeof resource.paths!.route.show === 'string'
          ? resource.paths!.route.show
          : resource.paths!.route.show?.base,
        clone: typeof resource.paths!.route.clone === 'string'
          ? resource.paths!.route.clone
          : resource.paths!.route.clone?.base,
      },
    }))

  // 生成 Refine 兼容格式的资源
  const refineCompatibleResources = refineResources.map(resource => ({
    name: resource.name,
    // 只有具有 paths 的资源才添加路由属性
    ...(resource.paths && {
      list: typeof resource.paths.route.list === 'string'
        ? resource.paths.route.list
        : resource.paths.route.list?.base,
      create: typeof resource.paths.route.create === 'string'
        ? resource.paths.route.create
        : resource.paths.route.create?.base,
      edit: typeof resource.paths.route.edit === 'string'
        ? resource.paths.route.edit
        : resource.paths.route.edit?.base,
      show: typeof resource.paths.route.show === 'string'
        ? resource.paths.route.show
        : resource.paths.route.show?.base,
      clone: typeof resource.paths.route.clone === 'string'
        ? resource.paths.route.clone
        : resource.paths.route.clone?.base,
    }),
    meta: resource.meta,
  }))

  return {
    refineResources,
    refineCompatibleResources,
    apiResources,
    permissionResources,
    routeResources,
  }
}

/**
 * 解析路径配置，支持字符串或PathConfig对象
 */
export function parsePathConfig(config: string | PathConfig): PathConfig {
  if (typeof config === 'string') {
    return { base: config }
  }
  return config
}

/**
 * 替换路径中的参数占位符
 * 支持 :id, {id} 两种格式
 */
export function replacePathParams(
  path: string,
  params: Record<string, string | number> = {},
): string {
  let resolvedPath = path

  // 替换 :param 格式的参数
  resolvedPath = resolvedPath.replace(/:(\w+)/g, (match, paramName) => {
    const value = params[paramName]
    return value !== undefined ? String(value) : match
  })

  // 替换 {param} 格式的参数
  resolvedPath = resolvedPath.replace(/\{(\w+)\}/g, (match, paramName) => {
    const value = params[paramName]
    return value !== undefined ? String(value) : match
  })

  return resolvedPath
}

/**
 * 构建查询字符串
 */
export function buildQueryString(query: Record<string, any> = {}): string {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, String(v)))
      }
      else {
        params.append(key, String(value))
      }
    }
  })

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ''
}

/**
 * 获取资源配置
 */
export function getResourceConfig(
  resources: ExtendedResourceItem[],
  resourceName: string,
): ExtendedResourceItem | undefined {
  return resources.find(resource => resource.name === resourceName)
}

/**
 * 解析资源路径
 */
export function resolveResourcePath(
  resource: ExtendedResourceItem,
  pathType: PathType,
  action: ResourceAction | string,
  options: PathResolveOptions = {},
): ResolvedPath {
  const { params = {}, query = {} } = options

  if (!resource.paths) {
    throw new Error(`Resource "${resource.name}" has no paths configuration`)
  }

  let pathConfig: string | PathConfig | undefined
  let httpMethod = DEFAULT_HTTP_METHODS[action]

  // 获取路径配置
  switch (pathType) {
    case 'route':
      // delete 操作通常不需要单独的路由，可以使用 list 页面
      if (action === 'delete') {
        pathConfig = resource.paths.route.list
      }
      else {
        // 类型安全的属性访问
        const routePaths = resource.paths.route as Record<string, string | PathConfig | undefined>
        pathConfig = routePaths[action]
      }
      break
    case 'api':
      if (!resource.paths.api) {
        throw new Error(`Resource "${resource.name}" has no api paths configuration`)
      }
      if (action === 'list' || action === 'create') {
        pathConfig = resource.paths.api.base
      }
      else {
        // 对于 show/edit/delete，通常需要ID
        const baseConfig = parsePathConfig(resource.paths.api.base)
        pathConfig = {
          base: `${baseConfig.base}/:id`,
          params: baseConfig.params,
        }
      }
      break
    case 'permission':
      if (!resource.paths.permission) {
        throw new Error(`Resource "${resource.name}" has no permission paths configuration`)
      }
      
      // 首先检查是否是自定义权限
      const customPermission = resource.permissions?.custom?.find(p => p.action === action)
      if (customPermission) {
        // 处理自定义权限
        const baseConfig = parsePathConfig(resource.paths.permission.base)
        pathConfig = {
          base: `${baseConfig.base}/${customPermission.path}`,
          params: baseConfig.params,
        }
        httpMethod = customPermission.method
      }
      else {
        // 处理标准权限
        if (action === 'list' || action === 'create') {
          pathConfig = resource.paths.permission.base
        }
        else {
          // 对于 show/edit/delete，需要添加ID部分
          const baseConfig = parsePathConfig(resource.paths.permission.base)
          pathConfig = {
            base: `${baseConfig.base}/:id`,
            params: baseConfig.params,
          }
        }
        // 使用自定义HTTP方法映射（如果有）
        if (resource.paths.permission.methods?.[action as ResourceAction]) {
          httpMethod = resource.paths.permission.methods[action as ResourceAction]
        }
      }
      break
  }

  if (!pathConfig) {
    throw new Error(
      `Path configuration not found for resource "${resource.name}", pathType "${pathType}", action "${action}"`,
    )
  }

  // 解析路径配置
  const config = parsePathConfig(pathConfig)
  let resolvedPath = config.base

  // 合并参数
  const allParams = { ...config.params, ...params }

  // 替换参数
  resolvedPath = replacePathParams(resolvedPath, allParams)

  // 添加查询字符串
  const queryString = buildQueryString(query)
  resolvedPath += queryString

  const result = {
    path: resolvedPath,
    method: httpMethod,
    config: pathConfig,
  }

  return result
}

/**
 * 简化的 API 路径获取函数
 * 直接使用 apiResources 格式
 */
export function getSimpleApiPath(
  apiResources: Array<{ name: string, apiBase: string, apiBulk?: string }>,
  resourceName: string,
  action: ResourceAction,
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
export function getBulkApiPath(
  apiResources: Array<{ name: string, apiBase: string, apiBulk?: string }>,
  resourceName: string,
): string {
  const resource = apiResources.find(r => r.name === resourceName)
  if (!resource) {
    throw new Error(`Resource "${resourceName}" not found`)
  }

  return resource.apiBulk || `${resource.apiBase}/bulk`
}

/**
 * 获取权限路径
 * 便捷函数，用于accessControl
 */
export function getPermissionPath(
  resources: ExtendedResourceItem[],
  resourceName: string,
  action: ResourceAction | string,
  options: PathResolveOptions = {},
): ResolvedPath {
  const resource = getResourceConfig(resources, resourceName)
  if (!resource) {
    const error = `Resource "${resourceName}" not found`
    console.error('❌ [路径调试]', error)
    throw new Error(error)
  }

  const resolved = resolveResourcePath(resource, 'permission', action, options)

  return resolved
}

/**
 * 获取路由路径
 * 便捷函数，用于路由配置
 */
export function getRoutePath(
  resources: ExtendedResourceItem[],
  resourceName: string,
  action: ResourceAction | string,
  options: PathResolveOptions = {},
): string {
  const resource = getResourceConfig(resources, resourceName)
  if (!resource) {
    throw new Error(`Resource "${resourceName}" not found`)
  }

  const resolved = resolveResourcePath(resource, 'route', action, options)
  return resolved.path
}

/**
 * 验证路径配置
 */
export function validateResourcePaths(resource: ExtendedResourceItem): string[] {
  const errors: string[] = []

  if (!resource.paths) {
    errors.push(`Resource "${resource.name}" missing paths configuration`)
    return errors
  }

  // 检查必需的配置
  if (!resource.paths.api?.base) {
    errors.push(`Resource "${resource.name}" missing api.base configuration`)
  }

  if (!resource.paths.permission?.base) {
    errors.push(`Resource "${resource.name}" missing permission.base configuration`)
  }

  // 检查路由配置
  const routeActions = ['list', 'create', 'edit', 'show'] as const
  const hasAnyRoute = routeActions.some(action => resource.paths!.route[action])

  if (!hasAnyRoute) {
    errors.push(`Resource "${resource.name}" missing route configuration`)
  }

  // 验证路径格式
  const { api, permission, route } = resource.paths

  // API路径不应该以/开头 (解析为字符串进行检查)
  if (api?.base) {
    const apiBaseStr = typeof api.base === 'string' ? api.base : api.base.base
    if (apiBaseStr.startsWith('/')) {
      errors.push(`Resource "${resource.name}" api.base should not start with "/" (found: "${apiBaseStr}")`)
    }
  }

  // 权限路径应该以/开头 (解析为字符串进行检查)
  if (permission?.base) {
    const permissionBaseStr = typeof permission.base === 'string' ? permission.base : permission.base.base
    if (!permissionBaseStr.startsWith('/')) {
      errors.push(`Resource "${resource.name}" permission.base should start with "/" (found: "${permissionBaseStr}")`)
    }
  }

  // 检查路由路径格式
  Object.entries(route).forEach(([action, path]) => {
    if (path && typeof path === 'string' && !path.startsWith('/')) {
      errors.push(`Resource "${resource.name}" route.${action} should start with "/" (found: "${path}")`)
    }
  })

  return errors
}

/**
 * 调试工具：打印资源路径信息
 */
export function debugResourcePaths(
  resources: ExtendedResourceItem[],
  resourceName?: string,
): void {
  const resourcesToDebug = resourceName
    ? resources.filter(r => r.name === resourceName)
    : resources

  resourcesToDebug.forEach((resource) => {
    // eslint-disable-next-line no-console
    console.group(`🔍 Resource: ${resource.name}`)

    // 验证配置
    const errors = validateResourcePaths(resource)
    if (errors.length > 0) {
      console.error('❌ Validation Errors:', errors)
    }

    // 打印各种路径
    const actions: ResourceAction[] = ['list', 'create', 'edit', 'show', 'delete']

    actions.forEach((action) => {
      try {
        const apiPath = resolveResourcePath(resource, 'api', action)
        const permissionPath = resolveResourcePath(resource, 'permission', action)

        // eslint-disable-next-line no-console
        console.log(`📋 Action: ${action}`)
        // eslint-disable-next-line no-console
        console.log(`  API: ${apiPath.method} ${apiPath.path}`)
        // eslint-disable-next-line no-console
        console.log(`  Permission: ${permissionPath.method} ${permissionPath.path}`)

        if (action === 'delete' || (resource.paths && (resource.paths.route as Record<string, any>)[action])) {
          const routePath = resolveResourcePath(resource, 'route', action)
          // eslint-disable-next-line no-console
          console.log(`  Route: ${routePath.path}`)
        }
      }
      catch (error) {
        // eslint-disable-next-line no-console
        console.log(`📋 Action: ${action} - ⚠️  ${error}`)
      }
    })

    // eslint-disable-next-line no-console
    console.groupEnd()
  })
}
