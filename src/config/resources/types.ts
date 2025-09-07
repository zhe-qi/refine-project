import type { IResourceItem } from '@refinedev/core'

/**
 * 权限定义
 */
export interface Permission {
  /** 操作标识 */
  action: string
  /** 显示名称 */
  title: string
  /** API/权限路径 */
  path: string
  /** HTTP 方法 */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
}

/**
 * 资源元数据
 */
export interface ResourceMeta {
  /** 显示标签 */
  label: string
  /** 父级资源名称 */
  parent?: string
  /** 排序权重 */
  sort?: number
  /** 图标 */
  icon?: string
  /** 是否可删除 */
  canDelete?: boolean
  /** 是否在菜单中隐藏 */
  hideInMenu?: boolean
}

/**
 * 资源定义（输入格式）
 */
export interface ResourceDefinition {
  /** 资源名称 */
  name: string
  /** 权限配置 */
  permissions?: Permission[]
  /** 元数据 */
  meta?: ResourceMeta
}

/**
 * 全局配置
 */
export interface GlobalConfig {
  /** API 前缀 */
  apiPrefix?: string
  /** 默认资源 */
  defaultResource?: string
  /** 默认元数据 */
  defaults?: {
    meta?: Partial<ResourceMeta>
  }
}

/**
 * Refine 兼容资源
 */
export interface RefineResource extends IResourceItem {
  name: string
  list?: string
  create?: string
  edit?: string
  show?: string
  clone?: string
  meta?: ResourceMeta & IResourceItem['meta']
}

/**
 * API 资源映射
 */
export interface ApiResource {
  /** 资源名称 */
  name: string
  /** API 基础路径 */
  apiBase: string
  /** 批量操作路径 */
  apiBulk?: string
}

/**
 * 权限资源映射
 */
export interface PermissionResource {
  /** 资源名称 */
  name: string
  /** 权限基础路径 */
  permissionBase: string
  /** HTTP 方法映射 */
  methods?: Record<string, string>
}

/**
 * 路由资源映射
 */
export interface RouteResource {
  /** 资源名称 */
  name: string
  /** 路由配置 */
  routes: {
    list?: string
    create?: string
    edit?: string
    show?: string
    clone?: string
  }
}

/**
 * 静态路由配置
 */
export interface StaticRoute {
  /** 资源名称 */
  name: string
  /** 基础路径 */
  path: string
  /** 路由配置 */
  routes: {
    list?: string
    create?: string
    edit?: string
    show?: string
    clone?: string
  }
  /** 组件配置 */
  components?: Record<string, () => Promise<{ default: any }>>
}

/**
 * 转换后的资源集合
 */
export interface TransformedResources {
  /** Refine 框架使用的资源 */
  refineResources: RefineResource[]
  /** API 路径映射 */
  apiResources: ApiResource[]
  /** 权限控制资源 */
  permissionResources: PermissionResource[]
  /** 路由资源映射 */
  routeResources: RouteResource[]
  /** 静态路由配置 */
  staticRoutes: StaticRoute[]
}
