/* eslint-disable */
// @ts-ignore
import { request } from '@/api/request';

import * as API from './types';

/** 获取定时任务列表 返回所有定时任务的配置信息和状态，支持分页和筛选 GET /api/admin/scheduled-jobs */
export async function scheduledJobsUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.ScheduledJobsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return request<API.ScheduledJobsUsingGetResponse>(
    '/api/admin/scheduled-jobs',
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // limit has a default value: 20
        limit: '20',
        ...params,
      },
      ...(options || {}),
    }
  );
}

/** 创建定时任务 创建新的业务定时任务，系统任务只能由代码定义 POST /api/admin/scheduled-jobs */
export async function scheduledJobsUsingPost({
  body,
  options,
}: {
  body: API.ScheduledJobsUsingPostBody;
  options?: CustomRequestOptions;
}) {
  return request<API.ScheduledJobsUsingPostResponse>(
    '/api/admin/scheduled-jobs',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    }
  );
}

/** 更新定时任务 更新定时任务的配置，系统任务只能修改部分参数 PUT /api/admin/scheduled-jobs/${param0} */
export async function scheduledJobsIdUsingPut({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.ScheduledJobsIdUsingPutParams;
  body: API.ScheduledJobsIdUsingPutBody;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.ScheduledJobsIdUsingPutResponse>(
    `/api/admin/scheduled-jobs/${param0}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** 删除定时任务 删除指定的定时任务（仅限业务任务） DELETE /api/admin/scheduled-jobs/${param0} */
export async function scheduledJobsIdUsingDelete({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.ScheduledJobsIdUsingDeleteParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.ScheduledJobsIdUsingDeleteResponse>(
    `/api/admin/scheduled-jobs/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 手动触发定时任务 立即执行指定的定时任务 POST /api/admin/scheduled-jobs/${param0}/execute */
export async function scheduledJobsIdExecuteUsingPost({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.ScheduledJobsIdExecuteUsingPostParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<unknown>(`/api/admin/scheduled-jobs/${param0}/execute`, {
    method: 'POST',
    params: { ...queryParams },
    ...(options || {}),
  });
}

/** 获取定时任务执行历史 返回指定定时任务的执行历史记录 GET /api/admin/scheduled-jobs/${param0}/logs */
export async function scheduledJobsIdLogsUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.ScheduledJobsIdLogsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.ScheduledJobsIdLogsUsingGetResponse>(
    `/api/admin/scheduled-jobs/${param0}/logs`,
    {
      method: 'GET',
      params: {
        // page has a default value: 1
        page: '1',
        // limit has a default value: 20
        limit: '20',
        ...queryParams,
      },
      ...(options || {}),
    }
  );
}

/** 启用/禁用定时任务 切换定时任务的启用状态 POST /api/admin/scheduled-jobs/${param0}/toggle */
export async function scheduledJobsIdToggleUsingPost({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.ScheduledJobsIdToggleUsingPostParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.ScheduledJobsIdToggleUsingPostResponse>(
    `/api/admin/scheduled-jobs/${param0}/toggle`,
    {
      method: 'POST',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
