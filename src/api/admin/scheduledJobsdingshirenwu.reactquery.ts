/* eslint-disable */
// @ts-ignore
import { queryOptions, useMutation } from '@tanstack/react-query';
import type { DefaultError } from '@tanstack/react-query';
import { request } from '@/api/request';

import * as apis from './scheduledJobsdingshirenwu';
import * as API from './types';

/** 获取定时任务列表 返回所有定时任务的配置信息和状态，支持分页和筛选 GET /api/admin/scheduled-jobs */
export function scheduledJobsUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.ScheduledJobsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.scheduledJobsUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['scheduledJobsUsingGet', options],
  });
}

/** 创建定时任务 创建新的业务定时任务，系统任务只能由代码定义 POST /api/admin/scheduled-jobs */
export function useScheduledJobsUsingPostMutation(options?: {
  onSuccess?: (value?: API.ScheduledJobsUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.scheduledJobsUsingPost,
    onSuccess(data: API.ScheduledJobsUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 更新定时任务 更新定时任务的配置，系统任务只能修改部分参数 PUT /api/admin/scheduled-jobs/${param0} */
export function useScheduledJobsIdUsingPutMutation(options?: {
  onSuccess?: (value?: API.ScheduledJobsIdUsingPutResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.scheduledJobsIdUsingPut,
    onSuccess(data: API.ScheduledJobsIdUsingPutResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 删除定时任务 删除指定的定时任务（仅限业务任务） DELETE /api/admin/scheduled-jobs/${param0} */
export function useScheduledJobsIdUsingDeleteMutation(options?: {
  onSuccess?: (value?: API.ScheduledJobsIdUsingDeleteResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.scheduledJobsIdUsingDelete,
    onSuccess(data: API.ScheduledJobsIdUsingDeleteResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 手动触发定时任务 立即执行指定的定时任务 POST /api/admin/scheduled-jobs/${param0}/execute */
export function useScheduledJobsIdExecuteUsingPostMutation(options?: {
  onSuccess?: (value?: unknown) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.scheduledJobsIdExecuteUsingPost,
    onSuccess(data: unknown) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 获取定时任务执行历史 返回指定定时任务的执行历史记录 GET /api/admin/scheduled-jobs/${param0}/logs */
export function scheduledJobsIdLogsUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.ScheduledJobsIdLogsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.scheduledJobsIdLogsUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['scheduledJobsIdLogsUsingGet', options],
  });
}

/** 启用/禁用定时任务 切换定时任务的启用状态 POST /api/admin/scheduled-jobs/${param0}/toggle */
export function useScheduledJobsIdToggleUsingPostMutation(options?: {
  onSuccess?: (value?: API.ScheduledJobsIdToggleUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.scheduledJobsIdToggleUsingPost,
    onSuccess(data: API.ScheduledJobsIdToggleUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}
