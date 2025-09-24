import type { ResourceDefinition } from './types'

/**
 * 系统管理模块资源配置
 */
export const systemResources: ResourceDefinition[] = [
  // 系统管理父级菜单
  {
    name: 'system',
    meta: {
      label: '系统管理',
      sort: 100,
    },
  },
  // 用户管理
  {
    name: 'user',
    permissions: [
      {
        action: 'list',
        title: '用户列表',
        path: '/system/user',
        method: 'GET',
      },
      {
        action: 'create',
        title: '创建用户',
        path: '/system/user',
        method: 'POST',
      },
      {
        action: 'edit',
        title: '编辑用户',
        path: '/system/user/{id}',
        method: 'PATCH',
      },
      {
        action: 'show',
        title: '查看用户',
        path: '/system/user/{id}',
        method: 'GET',
      },
      {
        action: 'delete',
        title: '删除用户',
        path: '/system/user/{id}',
        method: 'DELETE',
      },
      {
        action: 'updateRoles',
        title: '更新角色',
        path: '/system/user/{id}/roles',
        method: 'PUT',
      },
    ],
    meta: {
      label: '用户管理',
      parent: 'system',
      sort: 1,
      canDelete: true,
    },
  },
  // 角色管理
  {
    name: 'role',
    permissions: [
      {
        action: 'list',
        title: '角色列表',
        path: '/system/role',
        method: 'GET',
      },
      {
        action: 'create',
        title: '创建角色',
        path: '/system/role',
        method: 'POST',
      },
      {
        action: 'edit',
        title: '编辑角色',
        path: '/system/role/{id}',
        method: 'PATCH',
      },
      {
        action: 'show',
        title: '查看角色',
        path: '/system/role/{id}',
        method: 'GET',
      },
      {
        action: 'delete',
        title: '删除角色',
        path: '/system/role/{id}',
        method: 'DELETE',
      },
      {
        action: 'getPermissions',
        title: '获取权限',
        path: '/system/role/{id}/permissions',
        method: 'GET',
      },
      {
        action: 'updatePermissions',
        title: '更新权限',
        path: '/system/role/{id}/permissions',
        method: 'PUT',
      },
    ],
    meta: {
      label: '角色管理',
      parent: 'system',
      sort: 2,
      canDelete: true,
    },
  },
]
