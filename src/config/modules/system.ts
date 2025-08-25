import type { ExtendedResourceItem } from '@/types/resource'

/**
 * 系统管理模块资源配置
 * 包含用户管理、角色管理等系统级资源
 */
export const systemResources: ExtendedResourceItem[] = [
  // 系统管理父级菜单
  {
    name: 'system',
    meta: {
      label: '系统管理',
      sort: 100,
    },
  },
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
    // 只需定义自定义权限，标准权限会在 defineConfig 中继承
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
      parent: 'system',
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
    // 只需定义自定义权限，标准权限会在 defineConfig 中继承
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
      parent: 'system',
      sort: 2,
    },
  },
]
