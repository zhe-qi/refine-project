import type { IResourceItem } from '@refinedev/core'

/**
 * 自定义权限配置
 */
export interface CustomPermission {
  /** 操作标识，如 'addRole', 'removeRole' */
  action: string
  /** 显示名称，如 '分配角色', '删除角色' */
  title: string
  /** API路径片段，支持参数占位符，如 '{id}/roles' */
  path: string
  /** HTTP方法 */
  method: string
}

/**
 * 权限配置接口
 */
export interface PermissionConfig {
  /** 标准权限，支持的标准操作列表 */
  standard?: Array<'list' | 'show' | 'create' | 'edit' | 'delete'>
  /** 自定义权限配置 */
  custom?: CustomPermission[]
}

/**
 * 路径配置接口
 * 支持多种路径模式的定义
 */
export interface PathConfig {
  /** 基础路径，支持参数占位符如 :id */
  base: string
  /** 路径参数映射，用于复杂的路径转换 */
  params?: Record<string, string>
}

/**
 * HTTP方法映射配置
 * 定义Refine操作到HTTP方法的映射
 */
export interface HttpMethodMap {
  list?: string
  show?: string
  create?: string
  edit?: string
  delete?: string
  [key: string]: string | undefined
}

/**
 * 路径映射配置
 * 统一管理前端路由、API路径、权限路径
 */
export interface PathMapping {
  /** 前端路由路径 - 对应Refine的list/create/edit/show */
  route: {
    list?: string | PathConfig
    create?: string | PathConfig
    edit?: string | PathConfig
    show?: string | PathConfig
    clone?: string | PathConfig
  }
  /** 后端API路径 - 用于数据请求 */
  api?: {
    base: string | PathConfig
    /** 可选的批量操作路径 */
    bulk?: string | PathConfig
  }
  /** 权限校验路径 - 用于访问控制 */
  permission?: {
    base: string | PathConfig
    /** 自定义HTTP方法映射 */
    methods?: HttpMethodMap
  }
}

/**
 * 扩展的资源配置接口
 * 在Refine的IResourceItem基础上添加路径映射功能
 */
export interface ExtendedResourceItem extends Omit<IResourceItem, 'list' | 'create' | 'edit' | 'show' | 'clone'> {
  /** 资源名称 */
  name: string

  /** 统一的路径映射配置（对于父级菜单资源，此项为可选） */
  paths?: PathMapping

  /** 权限配置 */
  permissions?: PermissionConfig

  /** 可选的Refine原生路径配置（用于向后兼容） */
  list?: IResourceItem['list']
  create?: IResourceItem['create']
  edit?: IResourceItem['edit']
  show?: IResourceItem['show']
  clone?: IResourceItem['clone']

  /** 扩展的元数据 */
  meta?: IResourceItem['meta'] & {
    /** 标签名称 */
    label?: string
    /** 父级资源名称（用于多级菜单） */
    parent?: string
    /** 是否可删除 */
    canDelete?: boolean
    /** 图标 */
    icon?: string
    /** 排序权重 */
    sort?: number
    /** 是否在导航中隐藏 */
    hideInMenu?: boolean
    /** 自定义权限规则 */
    customPermissions?: Record<string, any>
  }
}

/**
 * 资源操作类型
 */
export type ResourceAction = 'list' | 'show' | 'create' | 'edit' | 'delete' | 'clone'

/**
 * 路径类型
 */
export type PathType = 'route' | 'api' | 'permission'

/**
 * 路径解析选项
 */
export interface PathResolveOptions {
  /** 路径参数，如 { id: '123' } */
  params?: Record<string, string | number>
  /** 查询参数 */
  query?: Record<string, any>
  /** 是否包含基础URL */
  includeBaseUrl?: boolean
}

/**
 * 路径解析结果
 */
export interface ResolvedPath {
  /** 解析后的路径 */
  path: string
  /** HTTP方法 */
  method: string
  /** 原始配置 */
  config: PathConfig | string
}
