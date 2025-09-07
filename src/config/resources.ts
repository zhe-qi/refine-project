// 重新导出新的资源配置
export {
  apiResources,
  getAllPermissions,
  getAllResourceNames,
  getBulkApiPath,
  getPermissionPath,
  getResourceConfig,
  getSimpleApiPath,
  type PermissionItem,
  permissionResources,
  refineCompatibleResources,
  refineResources,
  routeResources,
  staticRoutes,
  systemResources,
} from './resources/index'

// 为了保持向后兼容，也导出 resources 作为 refineCompatibleResources 的别名
export { refineCompatibleResources as resources } from './resources/index'

/**
 * 获取扩展资源配置的便捷函数
 */
export { getResourceConfig as getExtendedResource } from './resources/index'

/**
 * 获取所有资源名称（别名）
 */
export { getAllResourceNames as getResourceNames } from './resources/index'
