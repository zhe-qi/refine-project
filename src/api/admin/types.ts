/* eslint-disable */
// @ts-ignore

export type AuthChallengeUsingPostResponse = {
  data: {
    /** 验证码挑战数据 */
    challenge: unknown;
    /** 挑战token */
    token: string;
    /** 过期时间戳 */
    expires: number;
  };
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
  data: {
    /** 验证结果 */
    success: boolean;
    /** 验证token */
    token: string;
    /** 过期时间戳 */
    expires: number;
  };
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

export type SystemRolesIdPermissionsUsingDeleteBody = {
  /** 权限列表 */
  permissions: unknown[][];
};

export type SystemRolesIdPermissionsUsingDeleteParams = {
  /** 角色ID */
  id: string;
};

export type SystemRolesIdPermissionsUsingDeleteResponse = {
  data: {
    count: number;
  };
};

export type SystemRolesIdPermissionsUsingGetParams = {
  /** 角色ID */
  id: string;
};

export type SystemRolesIdPermissionsUsingGetResponse = {
  data: string[][];
};

export type SystemRolesIdPermissionsUsingPostBody = {
  /** 权限列表 */
  permissions: unknown[][];
};

export type SystemRolesIdPermissionsUsingPostParams = {
  /** 角色ID */
  id: string;
};

export type SystemRolesIdPermissionsUsingPostResponse = {
  data: {
    count: number;
  };
};

export type SystemRolesIdUsingDeleteParams = {
  /** 角色ID */
  id: string;
};

export type SystemRolesIdUsingDeleteResponse = {
  data: {
    /** 角色ID */
    id: string;
  };
};

export type SystemRolesIdUsingGetParams = {
  /** 角色ID */
  id: string;
};

export type SystemRolesIdUsingGetResponse = {
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

export type SystemRolesIdUsingPatchBody = {
  id?: string;
  createdBy?: unknown;
  name?: string;
  description?: unknown;
  status?: number;
};

export type SystemRolesIdUsingPatchParams = {
  /** 角色ID */
  id: string;
};

export type SystemRolesIdUsingPatchResponse = {
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

export type SystemRolesUsingGetParams = {
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

export type SystemRolesUsingGetResponse = {
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

export type SystemRolesUsingPostBody = {
  id: string;
  createdBy?: unknown;
  name: string;
  description?: unknown;
  status?: number;
};

export type SystemRolesUsingPostResponse = {
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

export type SystemUsersIdUsingDeleteParams = {
  id: string;
};

export type SystemUsersIdUsingDeleteResponse = {
  data: {
    id: string;
  };
};

export type SystemUsersIdUsingGetParams = {
  id: string;
};

export type SystemUsersIdUsingGetResponse = {
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

export type SystemUsersIdUsingPatchBody = {
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

export type SystemUsersIdUsingPatchParams = {
  id: string;
};

export type SystemUsersIdUsingPatchResponse = {
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

export type SystemUsersUserIdRolesUsingDeleteBody = {
  roleIds: string[];
};

export type SystemUsersUserIdRolesUsingDeleteParams = {
  /** 用户id */
  userId: string;
};

export type SystemUsersUserIdRolesUsingDeleteResponse = {
  data: {
    count: number;
  };
};

export type SystemUsersUserIdRolesUsingPostBody = {
  roleIds: string[];
};

export type SystemUsersUserIdRolesUsingPostParams = {
  /** 用户ID */
  userId: string;
};

export type SystemUsersUserIdRolesUsingPostResponse = {
  data: {
    count: number;
  };
};

export type SystemUsersUsingGetParams = {
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

export type SystemUsersUsingGetResponse = {
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

export type SystemUsersUsingPostBody = {
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

export type SystemUsersUsingPostResponse = {
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
