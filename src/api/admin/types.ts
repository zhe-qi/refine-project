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

export type QueuesHealthUsingGetResponse = {
  data: Record<string, unknown>;
};

export type QueuesJobsIdPromoteUsingPostParams = {
  /** 任务ID */
  id: string;
};

export type QueuesJobsIdPromoteUsingPostResponse = {
  data: {
    success: boolean;
  };
};

export type QueuesJobsIdRetryUsingPostParams = {
  /** 任务ID */
  id: string;
};

export type QueuesJobsIdRetryUsingPostResponse = {
  data: {
    success: boolean;
  };
};

export type QueuesJobsIdUsingDeleteParams = {
  /** 任务ID */
  id: string;
};

export type QueuesJobsIdUsingDeleteResponse = {
  data: {
    success: boolean;
  };
};

export type QueuesJobsIdUsingGetParams = {
  /** 任务ID */
  id: string;
};

export type QueuesJobsIdUsingGetResponse = {
  /** 任务信息 */
  data: {
    id: string;
    name: string;
    data: Record<string, unknown>;
    status:
      | 'waiting'
      | 'active'
      | 'completed'
      | 'failed'
      | 'delayed'
      | 'paused';
    progress: number;
    attempts: number;
    failedReason: string;
    processedOn: number;
    finishedOn: number;
    timestamp: number;
  };
};

export type QueuesNameJobsUsingGetParams = {
  /** 队列名称 */
  name: string;
  /** 任务状态筛选 */
  status?: 'waiting' | 'active' | 'completed' | 'failed' | 'delayed';
  /** 起始位置 */
  start?: unknown;
  /** 返回数量限制 */
  limit?: number;
};

export type QueuesNameJobsUsingGetResponse = {
  data: {
    id: string;
    name: string;
    data: Record<string, unknown>;
    status:
      | 'waiting'
      | 'active'
      | 'completed'
      | 'failed'
      | 'delayed'
      | 'paused';
    progress: number;
    attempts: number;
    failedReason?: string;
    processedOn?: number;
    finishedOn?: number;
    timestamp: number;
  }[];
};

export type QueuesNamePauseUsingPostParams = {
  /** 队列名称 */
  name: string;
};

export type QueuesNamePauseUsingPostResponse = {
  data: {
    success: boolean;
  };
};

export type QueuesNameResumeUsingPostParams = {
  /** 队列名称 */
  name: string;
};

export type QueuesNameResumeUsingPostResponse = {
  data: {
    success: boolean;
  };
};

export type QueuesNameStatsUsingGetParams = {
  /** 队列名称 */
  name: string;
};

export type QueuesNameStatsUsingGetResponse = {
  /** 队列统计信息 */
  data: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
    paused: number;
    total: number;
  };
};

export type QueuesNameUsingGetParams = {
  /** 队列名称 */
  name: string;
};

export type QueuesNameUsingGetResponse = {
  /** 队列信息 */
  data: {
    name: string;
    isPaused: boolean;
    /** 队列统计信息 */
    stats: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
      paused: number;
      total: number;
    };
  };
};

export type QueuesUsingGetResponse = {
  data: {
    name: string;
    isPaused: boolean;
    /** 队列统计信息 */
    stats: {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
      paused: number;
      total: number;
    };
  }[];
};

export type ScheduledJobsIdExecuteUsingPostParams = {
  /** 定时任务ID */
  id: string;
};

export type ScheduledJobsIdLogsUsingGetParams = {
  /** 定时任务ID */
  id: string;
  /** 执行状态筛选 */
  status?:
    | 'pending'
    | 'running'
    | 'success'
    | 'failed'
    | 'timeout'
    | 'cancelled';
  /** 开始日期 YYYY-MM-DD */
  startDate?: string;
  /** 结束日期 YYYY-MM-DD */
  endDate?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  limit?: number;
};

export type ScheduledJobsIdLogsUsingGetResponse = {
  data: {
    /** 执行日志ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 关联的定时任务ID */
    scheduledJobId: string;
    /** 任务名称 */
    jobName: string;
    /** 队列名称 */
    queueName: string;
    /** BullMQ任务ID */
    bullJobId: unknown;
    /** 执行状态 */
    status: string;
    /** 执行开始时间 */
    startedAt: unknown;
    /** 执行完成时间 */
    completedAt: unknown;
    /** 执行耗时（毫秒） */
    durationMs: unknown;
    /** 执行参数 */
    jobData:
      | string
      | number
      | boolean
      | null
      | Record<string, unknown>
      | unknown[]
      | null;
    /** 执行结果数据 */
    resultData:
      | string
      | number
      | boolean
      | null
      | Record<string, unknown>
      | unknown[]
      | null;
    /** 错误信息 */
    errorMessage: unknown;
    /** 错误堆栈信息 */
    errorStack: unknown;
    /** 重试次数 */
    retryCount: unknown;
    /** 最大重试次数 */
    maxRetries: unknown;
    /** 是否为手动触发 */
    isManualTrigger: unknown;
    /** 触发用户ID */
    triggeredBy: unknown;
    /** 执行进度百分比 */
    progress: unknown;
    /** 进度描述 */
    progressDescription: unknown;
    /** 执行节点信息 */
    executionNode: unknown;
    /** 内存使用峰值（KB） */
    memoryUsageKb: unknown;
    /** CPU使用时间（毫秒） */
    cpuTimeMs: unknown;
  }[];
};

export type ScheduledJobsIdToggleUsingPostParams = {
  /** 定时任务ID */
  id: string;
};

export type ScheduledJobsIdToggleUsingPostResponse = {
  data: {
    id: string;
    status: number;
    message: string;
  };
};

export type ScheduledJobsIdUsingDeleteParams = {
  /** 定时任务ID */
  id: string;
};

export type ScheduledJobsIdUsingDeleteResponse = {
  data: {
    id: string;
    message: string;
  };
};

export type ScheduledJobsIdUsingPutBody = {
  name?: string;
  description?: unknown;
  cronExpression?: unknown;
  intervalMs?: unknown;
  taskType?: 'SYSTEM' | 'BUSINESS';
  status?: number;
  queueName?: string;
  jobName?: string;
  jobData?:
    | string
    | number
    | boolean
    | null
    | Record<string, unknown>
    | unknown[]
    | null;
  isDeletable?: number;
  priority?: unknown;
  maxRetries?: unknown;
  timeoutSeconds?: unknown;
};

export type ScheduledJobsIdUsingPutParams = {
  /** 定时任务ID */
  id: string;
};

export type ScheduledJobsIdUsingPutResponse = {
  data: {
    /** 定时任务ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 任务名称（唯一标识） */
    name: string;
    /** 任务描述 */
    description: unknown;
    /** CRON表达式 */
    cronExpression: unknown;
    /** 间隔时间（毫秒） */
    intervalMs: unknown;
    /** 任务类型 */
    taskType: 'SYSTEM' | 'BUSINESS';
    /** 任务状态 */
    status: number;
    /** 队列名称 */
    queueName: string;
    /** 任务处理器名称 */
    jobName: string;
    /** 任务执行参数 */
    jobData:
      | string
      | number
      | boolean
      | null
      | Record<string, unknown>
      | unknown[]
      | null;
    /** 是否可删除 */
    isDeletable: number;
    /** 优先级（1-10） */
    priority: unknown;
    /** 最大重试次数 */
    maxRetries: unknown;
    /** 超时时间（秒） */
    timeoutSeconds: unknown;
    /** 下次执行时间 */
    nextRunAt: unknown;
    /** 上次执行时间 */
    lastRunAt: unknown;
    /** 上次执行状态 */
    lastRunStatus: unknown;
    /** 上次执行错误信息 */
    lastRunError: unknown;
    /** 总执行次数 */
    totalRuns: unknown;
    /** 成功执行次数 */
    successRuns: unknown;
    /** 失败执行次数 */
    failedRuns: unknown;
  };
};

export type ScheduledJobsUsingGetParams = {
  /** 任务类型筛选 */
  taskType?: 'SYSTEM' | 'BUSINESS';
  /** 任务状态筛选：1启用 0禁用 */
  status?: '0' | '1';
  /** 队列名称筛选 */
  queueName?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  limit?: number;
};

export type ScheduledJobsUsingGetResponse = {
  data: {
    /** 定时任务ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 任务名称（唯一标识） */
    name: string;
    /** 任务描述 */
    description: unknown;
    /** CRON表达式 */
    cronExpression: unknown;
    /** 间隔时间（毫秒） */
    intervalMs: unknown;
    /** 任务类型 */
    taskType: 'SYSTEM' | 'BUSINESS';
    /** 任务状态 */
    status: number;
    /** 队列名称 */
    queueName: string;
    /** 任务处理器名称 */
    jobName: string;
    /** 任务执行参数 */
    jobData:
      | string
      | number
      | boolean
      | null
      | Record<string, unknown>
      | unknown[]
      | null;
    /** 是否可删除 */
    isDeletable: number;
    /** 优先级（1-10） */
    priority: unknown;
    /** 最大重试次数 */
    maxRetries: unknown;
    /** 超时时间（秒） */
    timeoutSeconds: unknown;
    /** 下次执行时间 */
    nextRunAt: unknown;
    /** 上次执行时间 */
    lastRunAt: unknown;
    /** 上次执行状态 */
    lastRunStatus: unknown;
    /** 上次执行错误信息 */
    lastRunError: unknown;
    /** 总执行次数 */
    totalRuns: unknown;
    /** 成功执行次数 */
    successRuns: unknown;
    /** 失败执行次数 */
    failedRuns: unknown;
  }[];
};

export type ScheduledJobsUsingPostBody = {
  name: string;
  description?: unknown;
  cronExpression?: unknown;
  intervalMs?: unknown;
  taskType?: 'SYSTEM' | 'BUSINESS';
  status?: number;
  queueName: string;
  jobName: string;
  jobData?:
    | string
    | number
    | boolean
    | null
    | Record<string, unknown>
    | unknown[]
    | null;
  isDeletable?: number;
  priority?: unknown;
  maxRetries?: unknown;
  timeoutSeconds?: unknown;
};

export type ScheduledJobsUsingPostResponse = {
  data: {
    /** 定时任务ID */
    id: string;
    createdAt: unknown;
    createdBy: unknown;
    updatedAt: unknown;
    updatedBy: unknown;
    /** 任务名称（唯一标识） */
    name: string;
    /** 任务描述 */
    description: unknown;
    /** CRON表达式 */
    cronExpression: unknown;
    /** 间隔时间（毫秒） */
    intervalMs: unknown;
    /** 任务类型 */
    taskType: 'SYSTEM' | 'BUSINESS';
    /** 任务状态 */
    status: number;
    /** 队列名称 */
    queueName: string;
    /** 任务处理器名称 */
    jobName: string;
    /** 任务执行参数 */
    jobData:
      | string
      | number
      | boolean
      | null
      | Record<string, unknown>
      | unknown[]
      | null;
    /** 是否可删除 */
    isDeletable: number;
    /** 优先级（1-10） */
    priority: unknown;
    /** 最大重试次数 */
    maxRetries: unknown;
    /** 超时时间（秒） */
    timeoutSeconds: unknown;
    /** 下次执行时间 */
    nextRunAt: unknown;
    /** 上次执行时间 */
    lastRunAt: unknown;
    /** 上次执行状态 */
    lastRunStatus: unknown;
    /** 上次执行错误信息 */
    lastRunError: unknown;
    /** 总执行次数 */
    totalRuns: unknown;
    /** 成功执行次数 */
    successRuns: unknown;
    /** 失败执行次数 */
    failedRuns: unknown;
  };
};

export type SystemRolesIdPermissionsUsingGetParams = {
  /** 角色ID */
  id: string;
};

export type SystemRolesIdPermissionsUsingGetResponse = {
  data: string[][];
};

export type SystemRolesIdPermissionsUsingPutBody = {
  /** 权限列表（全量） */
  permissions: unknown[][];
};

export type SystemRolesIdPermissionsUsingPutParams = {
  /** 角色ID */
  id: string;
};

export type SystemRolesIdPermissionsUsingPutResponse = {
  data: {
    /** 新增权限数量 */
    added: number;
    /** 删除权限数量 */
    removed: number;
    /** 总权限数量 */
    total: number;
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

export type SystemUsersUserIdRolesUsingPutBody = {
  /** 角色列表（全量） */
  roleIds: string[];
};

export type SystemUsersUserIdRolesUsingPutParams = {
  /** 用户ID */
  userId: string;
};

export type SystemUsersUserIdRolesUsingPutResponse = {
  data: {
    /** 新增角色数量 */
    added: number;
    /** 删除角色数量 */
    removed: number;
    /** 总角色数量 */
    total: number;
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
