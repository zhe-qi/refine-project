import type { ResourceConfig } from '@/utils/resourcePath'
import { defineConfig } from '@/utils/resourcePath'
import { systemResources } from './system'

/**
 * 所有模块的资源数组集合
 */
const allModuleResources = [
  ...systemResources,
  // 未来可以添加其他模块：
  // ...businessResources,
  // ...reportResources,
]

/**
 * 使用 defineConfig 统一处理所有模块的资源配置
 */
const resourceConfigs = defineConfig({
  // 全局API前缀，所有资源默认使用此前缀
  apiPrefix: 'admin',

  // 全局默认配置
  defaults: {
    permissions: {
      standard: ['list', 'show', 'create', 'edit', 'delete'],
    },
    meta: {
      canDelete: true,
    },
  },

  // 全局设置默认跳转资源
  defaultResource: 'users',

  // 合并所有模块的资源配置
  resources: allModuleResources as ResourceConfig[],
})

/**
 * 导出合并后的资源配置
 */
export const {
  refineResources,
  refineCompatibleResources,
  apiResources,
  permissionResources,
  routeResources,
  staticRoutes,
} = resourceConfigs

/**
 * 获取所有资源名称
 */
export function getAllResourceNames(): string[] {
  return refineResources.map(resource => resource.name)
}

// 重新导出系统模块的内容以保持向后兼容
export { systemResources } from './system'
