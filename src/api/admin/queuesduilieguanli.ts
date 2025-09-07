/* eslint-disable */
// @ts-ignore
import { request } from '@/api/request';

import * as API from './types';

/** 获取所有队列概览 返回所有队列的基本信息和统计数据 GET /api/admin/queues */
export async function queuesUsingGet({
  options,
}: {
  options?: CustomRequestOptions;
}) {
  return request<API.QueuesUsingGetResponse>('/api/admin/queues', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取指定队列详情 返回指定队列的详细信息和统计数据 GET /api/admin/queues/${param0} */
export async function queuesNameUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesNameUsingGetParams;
  options?: CustomRequestOptions;
}) {
  const { name: param0, ...queryParams } = params;

  return request<API.QueuesNameUsingGetResponse>(
    `/api/admin/queues/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取队列任务列表 返回指定队列的任务列表，支持状态筛选和分页 GET /api/admin/queues/${param0}/jobs */
export async function queuesNameJobsUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesNameJobsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  const { name: param0, ...queryParams } = params;

  return request<API.QueuesNameJobsUsingGetResponse>(
    `/api/admin/queues/${param0}/jobs`,
    {
      method: 'GET',
      params: {
        // limit has a default value: 20
        limit: '20',
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 暂停队列 暂停指定队列的任务处理 POST /api/admin/queues/${param0}/pause */
export async function queuesNamePauseUsingPost({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesNamePauseUsingPostParams;
  options?: CustomRequestOptions;
}) {
  const { name: param0, ...queryParams } = params;

  return request<API.QueuesNamePauseUsingPostResponse>(
    `/api/admin/queues/${param0}/pause`,
    {
      method: 'POST',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 恢复队列 恢复指定队列的任务处理 POST /api/admin/queues/${param0}/resume */
export async function queuesNameResumeUsingPost({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesNameResumeUsingPostParams;
  options?: CustomRequestOptions;
}) {
  const { name: param0, ...queryParams } = params;

  return request<API.QueuesNameResumeUsingPostResponse>(
    `/api/admin/queues/${param0}/resume`,
    {
      method: 'POST',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取队列统计信息 返回指定队列的详细统计数据 GET /api/admin/queues/${param0}/stats */
export async function queuesNameStatsUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesNameStatsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  const { name: param0, ...queryParams } = params;

  return request<API.QueuesNameStatsUsingGetResponse>(
    `/api/admin/queues/${param0}/stats`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 获取队列健康状态 返回所有队列的健康状态信息 GET /api/admin/queues/health */
export async function queuesHealthUsingGet({
  options,
}: {
  options?: CustomRequestOptions;
}) {
  return request<API.QueuesHealthUsingGetResponse>('/api/admin/queues/health', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取任务详情 根据ID获取任务的详细信息 GET /api/admin/queues/jobs/${param0} */
export async function queuesJobsIdUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesJobsIdUsingGetParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.QueuesJobsIdUsingGetResponse>(
    `/api/admin/queues/jobs/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除任务 删除指定的任务 DELETE /api/admin/queues/jobs/${param0} */
export async function queuesJobsIdUsingDelete({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesJobsIdUsingDeleteParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.QueuesJobsIdUsingDeleteResponse>(
    `/api/admin/queues/jobs/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 提升延迟任务 将延迟任务提升为立即执行 POST /api/admin/queues/jobs/${param0}/promote */
export async function queuesJobsIdPromoteUsingPost({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesJobsIdPromoteUsingPostParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.QueuesJobsIdPromoteUsingPostResponse>(
    `/api/admin/queues/jobs/${param0}/promote`,
    {
      method: 'POST',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 重试失败任务 重试指定的失败任务 POST /api/admin/queues/jobs/${param0}/retry */
export async function queuesJobsIdRetryUsingPost({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.QueuesJobsIdRetryUsingPostParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.QueuesJobsIdRetryUsingPostResponse>(
    `/api/admin/queues/jobs/${param0}/retry`,
    {
      method: 'POST',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
