/* eslint-disable */
// @ts-ignore
import { queryOptions, useMutation } from '@tanstack/react-query';
import type { DefaultError } from '@tanstack/react-query';
import { request } from '@/api/request';

import * as apis from './queuesduilieguanli';
import * as API from './types';

/** 获取所有队列概览 返回所有队列的基本信息和统计数据 GET /api/admin/queues */
export function queuesUsingGetQueryOptions(options: {
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.queuesUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['queuesUsingGet', options],
  });
}

/** 获取指定队列详情 返回指定队列的详细信息和统计数据 GET /api/admin/queues/${param0} */
export function queuesNameUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesNameUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.queuesNameUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['queuesNameUsingGet', options],
  });
}

/** 获取队列任务列表 返回指定队列的任务列表，支持状态筛选和分页 GET /api/admin/queues/${param0}/jobs */
export function queuesNameJobsUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesNameJobsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.queuesNameJobsUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['queuesNameJobsUsingGet', options],
  });
}

/** 暂停队列 暂停指定队列的任务处理 POST /api/admin/queues/${param0}/pause */
export function useQueuesNamePauseUsingPostMutation(options?: {
  onSuccess?: (value?: API.QueuesNamePauseUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.queuesNamePauseUsingPost,
    onSuccess(data: API.QueuesNamePauseUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 恢复队列 恢复指定队列的任务处理 POST /api/admin/queues/${param0}/resume */
export function useQueuesNameResumeUsingPostMutation(options?: {
  onSuccess?: (value?: API.QueuesNameResumeUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.queuesNameResumeUsingPost,
    onSuccess(data: API.QueuesNameResumeUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 获取队列统计信息 返回指定队列的详细统计数据 GET /api/admin/queues/${param0}/stats */
export function queuesNameStatsUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesNameStatsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.queuesNameStatsUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['queuesNameStatsUsingGet', options],
  });
}

/** 获取队列健康状态 返回所有队列的健康状态信息 GET /api/admin/queues/health */
export function queuesHealthUsingGetQueryOptions(options: {
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.queuesHealthUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['queuesHealthUsingGet', options],
  });
}

/** 获取任务详情 根据ID获取任务的详细信息 GET /api/admin/queues/jobs/${param0} */
export function queuesJobsIdUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesJobsIdUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.queuesJobsIdUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['queuesJobsIdUsingGet', options],
  });
}

/** 删除任务 删除指定的任务 DELETE /api/admin/queues/jobs/${param0} */
export function useQueuesJobsIdUsingDeleteMutation(options?: {
  onSuccess?: (value?: API.QueuesJobsIdUsingDeleteResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.queuesJobsIdUsingDelete,
    onSuccess(data: API.QueuesJobsIdUsingDeleteResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 提升延迟任务 将延迟任务提升为立即执行 POST /api/admin/queues/jobs/${param0}/promote */
export function useQueuesJobsIdPromoteUsingPostMutation(options?: {
  onSuccess?: (value?: API.QueuesJobsIdPromoteUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.queuesJobsIdPromoteUsingPost,
    onSuccess(data: API.QueuesJobsIdPromoteUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 重试失败任务 重试指定的失败任务 POST /api/admin/queues/jobs/${param0}/retry */
export function useQueuesJobsIdRetryUsingPostMutation(options?: {
  onSuccess?: (value?: API.QueuesJobsIdRetryUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.queuesJobsIdRetryUsingPost,
    onSuccess(data: API.QueuesJobsIdRetryUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}
