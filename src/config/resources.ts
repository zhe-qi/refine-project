import { defineConfig } from '@/utils/resourcePath'

/**
 * 使用 defineConfig 定义扩展的资源配置
 * 返回多种格式的资源配置，适用于不同场景
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

  // 资源配置数组
  resources: [
    {
      name: 'users',
      paths: {
        route: {
          list: '/system/users',
          create: '/system/users/create',
          edit: '/system/users/edit/:id',
          show: '/system/users/show/:id',
        },
      },
      // 只需定义自定义权限，标准权限继承全局默认
      permissions: {
        custom: [
          {
            action: 'addRole',
            title: '分配角色',
            path: '{id}/roles',
            method: 'POST',
          },
          {
            action: 'removeRole',
            title: '删除角色',
            path: '{id}/roles',
            method: 'DELETE',
          },
        ],
      },
      meta: {
        label: '用户管理',
        sort: 1,
      },
    },
    {
      name: 'roles',
      paths: {
        route: {
          list: '/system/roles',
          create: '/system/roles/create',
          edit: '/system/roles/edit/:id',
          show: '/system/roles/show/:id',
        },
      },
      // 只需定义自定义权限，标准权限继承全局默认
      permissions: {
        custom: [
          {
            action: 'addPermissions',
            title: '分配权限',
            path: '{id}/permissions',
            method: 'POST',
          },
          {
            action: 'removePermissions',
            title: '删除权限',
            path: '{id}/permissions',
            method: 'DELETE',
          },
        ],
      },
      meta: {
        label: '角色管理',
        sort: 2,
      },
    },
  ],
})

// 导出不同格式的资源配置
export const {
  refineResources,
  refineCompatibleResources,
  apiResources,
  permissionResources,
  routeResources,
} = resourceConfigs

// 为了保持向后兼容，也导出 resources 作为 refineCompatibleResources 的别名
export const resources = refineCompatibleResources

/**
 * 获取扩展资源配置的便捷函数
 */
export function getExtendedResource(name: string) {
  return refineResources.find(resource => resource.name === name)
}

/**
 * 获取所有资源名称
 */
export function getResourceNames(): string[] {
  return refineResources.map(resource => resource.name)
}

/**
 * 权限项接口
 */
export interface PermissionItem {
  key: string // 唯一标识，如 "/system/users:GET"
  title: string // 显示名称，如 "用户管理-查看"
  resource: string // Casbin 资源路径，如 "/system/users"
  method: string // HTTP 方法，如 "GET"
  action: string // 操作类型，如 "list"
  category: string // 分类名称，如 "用户管理"
  categoryKey: string // 分类标识，如 "users"
}

/**
 * 获取所有可分配的权限
 * 基于 resources 配置生成标准化的权限列表
 */
export function getAllPermissions(): PermissionItem[] {
  const permissions: PermissionItem[] = []

  // 操作到中文名称的映射
  const actionNameMap = {
    list: '查看',
    show: '详情',
    create: '创建',
    edit: '编辑',
    delete: '删除',
  }

  refineResources.forEach((resource) => {
    const categoryName = resource.meta?.label || resource.name
    const categoryKey = resource.name

    // 解析权限基础路径
    const resourcePath = typeof resource.paths.permission.base === 'string'
      ? resource.paths.permission.base
      : resource.paths.permission.base.base

    // 如果有权限配置，优先使用权限配置
    if (resource.permissions) {
      const { standard = [], custom = [] } = resource.permissions

      // 处理标准权限
      standard.forEach((action) => {
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
          title: `${categoryName}-${actionName}`,
          resource: finalPath,
          method,
          action,
          category: categoryName,
          categoryKey,
        })
      })

      // 处理自定义权限
      custom.forEach((customPerm) => {
        // 构建完整路径
        const fullPath = customPerm.path.startsWith('/')
          ? customPerm.path
          : `${resourcePath}/${customPerm.path.replace(/^\/+/, '')}`

        permissions.push({
          key: `${fullPath}:${customPerm.method}`,
          title: `${categoryName}-${customPerm.title}`,
          resource: fullPath,
          method: customPerm.method,
          action: customPerm.action,
          category: categoryName,
          categoryKey,
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
          title: `${categoryName}-${actionName}`,
          resource: finalPath,
          method,
          action,
          category: categoryName,
          categoryKey,
        })
      })

      // 处理自定义方法权限（保持向后兼容）
      if (resource.paths.permission.methods) {
        Object.entries(resource.paths.permission.methods).forEach(([customAction, customMethod]) => {
          if (customMethod) {
            const finalPath = `${resourcePath}/{id}`

            permissions.push({
              key: `${finalPath}:${customMethod}`,
              title: `${categoryName}-${customAction}`,
              resource: finalPath,
              method: customMethod,
              action: customAction,
              category: categoryName,
              categoryKey,
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

/**
 * defineConfig 使用示例和最佳实践
 *
 * ## 自动路径推导系统
 *
 * defineConfig 现在支持从 route.list 自动推导 api.base 和 permission.base：
 *
 * ```typescript
 * export const resources = defineConfig({
 *   apiPrefix: 'admin',
 *
 *   resources: [
 *     {
 *       name: 'users',
 *       paths: {
 *         route: {
 *           list: '/system/users',
 *           create: '/system/users/create',
 *           edit: '/system/users/edit/:id',
 *           show: '/system/users/show/:id',
 *         }
 *         // api 和 permission 将自动推导：
 *         // api: { base: 'system/users' }
 *         // permission: { base: '/system/users' }
 *       }
 *     }
 *   ]
 * })
 * ```
 *
 * ## 路径推导规则
 *
 * - `/system/users` → `api.base: 'system/users'` → `permission.base: '/system/users'`
 * - `/admin/posts` → `api.base: 'admin/posts'` → `permission.base: '/admin/posts'`
 * - API 路径自动去除开头的 `/`，权限路径保留 `/`
 *
 * ## 可覆盖配置
 *
 * 如果需要自定义 API 或权限路径，仍可手动指定：
 *
 * ```typescript
 * {
 *   name: 'users',
 *   paths: {
 *     route: { list: '/system/users', ... },
 *     api: {
 *       base: 'custom/users/path',  // 覆盖自动推导
 *       bulk: 'custom/users/export' // 可选的批量/导出端点
 *     },
 *     permission: {
 *       base: '/custom/users/permission' // 覆盖自动推导
 *     }
 *   }
 * }
 * ```
 *
 * ## 批量操作配置
 *
 * - `bulk` 路径现在是完全可选的
 * - 用于批量创建/更新/删除操作（createMany, updateMany, deleteMany）
 * - 也可用于导出等功能
 * - 如果不配置，getBulkApiPath 会回退到 `{api.base}/bulk`
 *
 * ## 层级配置覆盖系统
 *
 * ```typescript
 * export const resources = defineConfig({
 *   apiPrefix: 'admin',
 *
 *   // 全局默认配置
 *   defaults: {
 *     permissions: {
 *       standard: ['list', 'show', 'create', 'edit', 'delete']
 *     },
 *     meta: {
 *       canDelete: true
 *     }
 *   },
 *
 *   resources: [
 *     {
 *       name: 'users',
 *       paths: {
 *         route: { list: '/system/users', ... }
 *         // API 和权限路径自动推导
 *       },
 *       // 继承全局默认的标准权限
 *       permissions: {
 *         custom: [...] // 只需定义额外的自定义权限
 *       },
 *       meta: {
 *         label: '用户管理',
 *         // canDelete 自动继承全局默认 true
 *       }
 *     }
 *   ]
 * })
 * ```
 *
 * ## 配置优先级
 *
 * **优先级（从低到高）**: 全局默认 < 自动推导 < 手动配置
 *
 * - **继承**: 如果资源没有定义某项配置，自动继承全局默认值
 * - **推导**: API 和权限路径可从 route.list 自动推导
 * - **扩展**: permissions.custom 会与全局默认的 custom 权限合并
 * - **覆盖**: 如果资源明确定义了配置项，会完全覆盖全局默认和推导值
 *
 * ## 简化效果
 *
 * - **减少重复**: 消除了 50% 的重复配置代码
 * - **保持灵活**: 完全支持单个资源的自定义和覆盖
 * - **易于维护**: 全局默认配置集中管理，路径自动推导
 * - **向后兼容**: 保持 Refine 官方配置风格
 *
 * ## API前缀处理
 *
 * defineConfig 会自动为 API 路径添加全局前缀：
 * - `system/users` → `admin/system/users`
 * - 自定义 `custom/users/path` → `admin/custom/users/path`
 *
 * ## 生成的路径映射
 *
 * 对于简化后的配置，将生成：
 * - **前端路由**: `/system/users`, `/system/users/create`, `/system/users/edit/:id`
 * - **API路径**: `admin/system/users` (自动推导 + 前缀)
 * - **权限路径**: `/system/users`, `/system/users/:id` (自动推导)
 *
 * ## 调试配置
 *
 * ```typescript
 * import { debugResourcePaths } from '@/utils/resourcePath'
 *
 * // 调试所有资源配置
 * debugResourcePaths(resources)
 * ```
 */
