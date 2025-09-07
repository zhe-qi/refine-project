import type {
  GlobalConfig,
  ResourceDefinition,
  ResourceMeta,
  TransformedResources,
} from '../resources/types'
import { transformToApiResources } from './api'
import { transformToPermissionResources } from './permission'
import { transformToRefineResources } from './refine'
import { transformToRouteResources, transformToStaticRoutes } from './route'

/**
 * 合并资源与全局默认配置
 */
function mergeWithDefaults(
  resource: ResourceDefinition,
  defaults?: { meta?: Partial<ResourceMeta> },
): ResourceDefinition {
  if (!defaults?.meta) {
    return resource
  }

  return {
    ...resource,
    meta: {
      ...defaults.meta,
      ...resource.meta,
    } as ResourceMeta,
  }
}

/**
 * 主转换函数
 * 将资源定义转换为多种格式
 */
export function transformResources(
  resources: ResourceDefinition[],
  config?: GlobalConfig,
): TransformedResources {
  const { apiPrefix = 'admin', defaults } = config || {}

  // 合并默认配置
  const mergedResources = resources.map(resource =>
    mergeWithDefaults(resource, defaults),
  )

  return {
    refineResources: transformToRefineResources(mergedResources, apiPrefix),
    apiResources: transformToApiResources(mergedResources, apiPrefix),
    permissionResources: transformToPermissionResources(mergedResources),
    routeResources: transformToRouteResources(mergedResources),
    staticRoutes: transformToStaticRoutes(mergedResources),
  }
}

/**
 * 定义资源配置的便捷函数
 */
export function defineResources(
  resources: ResourceDefinition[],
  config?: GlobalConfig,
): TransformedResources {
  return transformResources(resources, config)
}
