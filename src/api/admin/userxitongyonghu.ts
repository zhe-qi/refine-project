/* eslint-disable */
// @ts-ignore
import { request } from '@/api/request';

import * as API from './types';

/** 获取系统用户列表 GET /api/admin/system/user */
export async function systemUserUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUserUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return request<API.SystemUserUsingGetResponse>('/api/admin/system/user', {
    method: 'GET',
    params: {
      // current has a default value: 1
      current: '1',
      // pageSize has a default value: 10
      pageSize: '10',
      // mode has a default value: server
      mode: 'server',

      ...params,
    },
    ...(options || {}),
  });
}

/** 创建系统用户 POST /api/admin/system/user */
export async function systemUserUsingPost({
  body,
  options,
}: {
  body: API.SystemUserUsingPostBody;
  options?: CustomRequestOptions;
}) {
  return request<API.SystemUserUsingPostResponse>('/api/admin/system/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取系统用户详情 GET /api/admin/system/user/${param0} */
export async function systemUserIdUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUserIdUsingGetParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemUserIdUsingGetResponse>(
    `/api/admin/system/user/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除系统用户 DELETE /api/admin/system/user/${param0} */
export async function systemUserIdUsingDelete({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUserIdUsingDeleteParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemUserIdUsingDeleteResponse>(
    `/api/admin/system/user/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新系统用户 PATCH /api/admin/system/user/${param0} */
export async function systemUserIdUsingPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUserIdUsingPatchParams;
  body: API.SystemUserIdUsingPatchBody;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemUserIdUsingPatchResponse>(
    `/api/admin/system/user/${param0}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** 保存用户角色（全量更新） PUT /api/admin/system/user/${param0}/roles */
export async function systemUserUserIdRolesUsingPut({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUserUserIdRolesUsingPutParams;
  body: API.SystemUserUserIdRolesUsingPutBody;
  options?: CustomRequestOptions;
}) {
  const { userId: param0, ...queryParams } = params;

  return request<API.SystemUserUserIdRolesUsingPutResponse>(
    `/api/admin/system/user/${param0}/roles`,
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
