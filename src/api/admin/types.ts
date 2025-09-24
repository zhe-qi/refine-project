/* eslint-disable */
// @ts-ignore

export type AuthChallengeUsingPostResponse = {
  /** 验证码挑战数据 */
  challenge?: unknown;
  /** 挑战token */
  token?: string;
  /** 过期时间戳 */
  expires: number;
};

export type AuthLoginUsingPostBody = {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 验证码token */
  captchaToken: string;
};

export type AuthLoginUsingPostResponse = {
  data: {
    /** 访问令牌 */
    accessToken: string;
  };
};

export type AuthLogoutUsingPostResponse = {
  data: Record<string, unknown>;
};

export type AuthPermissionsUsingGetResponse = {
  data: {
    /** 权限列表 */
    permissions: string[];
  };
};

export type AuthRedeemUsingPostBody = {
  /** 挑战token */
  token: string;
  /** 用户解答 */
  solutions: number[];
};

export type AuthRedeemUsingPostResponse = {
  /** 验证结果 */
  success: boolean;
  /** 验证token */
  token?: string;
  /** 过期时间戳 */
  expires?: number;
};

export type AuthRefreshUsingPostResponse = {
  data: {
    /** 访问令牌 */
    accessToken: string;
  };
};

export type AuthUserinfoUsingGetResponse = {
  data: {
    /** 用户ID */
    id: string;
    /** 用户名 */
    username: string;
    /** 头像 */
    avatar: unknown;
    /** 昵称 */
    nickName: string;
    /** 用户角色 */
    roles: string[];
  };
};

export type SystemRoleIdPermissionsUsingGetParams = {
  /** 角色ID */
  id: string;
};

export type SystemRoleIdPermissionsUsingGetResponse = {
  data: string[][];
};

export type SystemRoleIdPermissionsUsingPutBody = {
  /** 权限列表（全量） */
  permissions: unknown[][];
};

export type SystemRoleIdPermissionsUsingPutParams = {
  /** 角色ID */
  id: string;
};

export type SystemRoleIdPermissionsUsingPutResponse = {
  data: {
    /** 新增权限数量 */
    added: number;
    /** 删除权限数量 */
    removed: number;
    /** 总权限数量 */
    total: number;
  };
};

export type SystemRoleIdUsingDeleteParams = {
  /** 角色ID */
  id: string;
};

export type SystemRoleIdUsingDeleteResponse = {
  data: {
    /** 角色ID */
    id: string;
  };
};

export type SystemRoleIdUsingGetParams = {
  /** 角色ID */
  id: string;
};

export type SystemRoleIdUsingGetResponse = {
  data: {
    /** 角色ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 角色名称 */
    name: string;
    /** 角色描述 */
    description: unknown;
    /** 状态: 1=启用 0=禁用 */
    status: number;
  };
};

export type SystemRoleIdUsingPatchBody = {
  id?: string;
  createdBy?: unknown;
  name?: string;
  description?: unknown;
  status?: number;
};

export type SystemRoleIdUsingPatchParams = {
  /** 角色ID */
  id: string;
};

export type SystemRoleIdUsingPatchResponse = {
  data: {
    /** 角色ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 角色名称 */
    name: string;
    /** 角色描述 */
    description: unknown;
    /** 状态: 1=启用 0=禁用 */
    status: number;
  };
};

export type SystemRoleUsingGetParams = {
  /** 当前页码 */
  current?: number;
  /** 每页大小 */
  pageSize?: number;
  /** 分页模式：server=服务端分页，client=客户端分页，off=不分页 */
  mode?: 'server' | 'client' | 'off';
  /** 过滤条件，JSON 字符串格式 */
  filters?: string;
  /** 排序条件，JSON 字符串格式 */
  sorters?: string;
};

export type SystemRoleUsingGetResponse = {
  data: {
    /** 角色ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 角色名称 */
    name: string;
    /** 角色描述 */
    description: unknown;
    /** 状态: 1=启用 0=禁用 */
    status: number;
  }[];
};

export type SystemRoleUsingPostBody = {
  id: string;
  createdBy?: unknown;
  name: string;
  description?: unknown;
  status?: number;
};

export type SystemRoleUsingPostResponse = {
  data: {
    /** 角色ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 角色名称 */
    name: string;
    /** 角色描述 */
    description: unknown;
    /** 状态: 1=启用 0=禁用 */
    status: number;
  };
};

export type SystemUserIdUsingDeleteParams = {
  id: string;
};

export type SystemUserIdUsingDeleteResponse = {
  data: {
    id: string;
  };
};

export type SystemUserIdUsingGetParams = {
  id: string;
};

export type SystemUserIdUsingGetResponse = {
  data: {
    /** 用户ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 用户名 */
    username: string;
    /** 是否内置用户 */
    builtIn: unknown;
    /** 头像 */
    avatar: unknown;
    /** 昵称 */
    nickName: string;
    /** 状态: 1=启用 0=禁用 -1=封禁 */
    status: number;
  };
};

export type SystemUserIdUsingPatchBody = {
  /** 用户名 */
  username?: string;
  /** 密码 */
  password?: string;
  builtIn?: unknown;
  avatar?: unknown;
  /** 昵称 */
  nickName?: string;
  status?: number;
};

export type SystemUserIdUsingPatchParams = {
  id: string;
};

export type SystemUserIdUsingPatchResponse = {
  data: {
    /** 用户ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 用户名 */
    username: string;
    /** 是否内置用户 */
    builtIn: unknown;
    /** 头像 */
    avatar: unknown;
    /** 昵称 */
    nickName: string;
    /** 状态: 1=启用 0=禁用 -1=封禁 */
    status: number;
  };
};

export type SystemUserUserIdRolesUsingPutBody = {
  /** 角色列表（全量） */
  roleIds: string[];
};

export type SystemUserUserIdRolesUsingPutParams = {
  /** 用户ID */
  userId: string;
};

export type SystemUserUserIdRolesUsingPutResponse = {
  data: {
    /** 新增角色数量 */
    added: number;
    /** 删除角色数量 */
    removed: number;
    /** 总角色数量 */
    total: number;
  };
};

export type SystemUserUsingGetParams = {
  /** 当前页码 */
  current?: number;
  /** 每页大小 */
  pageSize?: number;
  /** 分页模式：server=服务端分页，client=客户端分页，off=不分页 */
  mode?: 'server' | 'client' | 'off';
  /** 过滤条件，JSON 字符串格式 */
  filters?: string;
  /** 排序条件，JSON 字符串格式 */
  sorters?: string;
};

export type SystemUserUsingGetResponse = {
  data: {
    /** 用户ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 用户名 */
    username: string;
    /** 是否内置用户 */
    builtIn: unknown;
    /** 头像 */
    avatar: unknown;
    /** 昵称 */
    nickName: string;
    /** 状态: 1=启用 0=禁用 -1=封禁 */
    status: number;
    /** 用户角色 */
    roles: {
      /** 角色ID */
      id: string;
      /** 角色名称 */
      name: string;
    }[];
  }[];
};

export type SystemUserUsingPostBody = {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  builtIn?: unknown;
  avatar?: unknown;
  /** 昵称 */
  nickName: string;
  status?: number;
};

export type SystemUserUsingPostResponse = {
  data: {
    /** 用户ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 用户名 */
    username: string;
    /** 是否内置用户 */
    builtIn: unknown;
    /** 头像 */
    avatar: unknown;
    /** 昵称 */
    nickName: string;
    /** 状态: 1=启用 0=禁用 -1=封禁 */
    status: number;
  };
};
