/* eslint-disable */
// @ts-ignore
import { request } from '@/api/request';

import * as API from './types';

/** 获取系统用户列表 GET /api/admin/system/users */
export async function systemUsersUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUsersUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return request<API.SystemUsersUsingGetResponse>('/api/admin/system/users', {
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

/** 创建系统用户 POST /api/admin/system/users */
export async function systemUsersUsingPost({
  body,
  options,
}: {
  body: API.SystemUsersUsingPostBody;
  options?: CustomRequestOptions;
}) {
  return request<API.SystemUsersUsingPostResponse>('/api/admin/system/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取系统用户详情 GET /api/admin/system/users/${param0} */
export async function systemUsersIdUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUsersIdUsingGetParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemUsersIdUsingGetResponse>(
    `/api/admin/system/users/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除系统用户 DELETE /api/admin/system/users/${param0} */
export async function systemUsersIdUsingDelete({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUsersIdUsingDeleteParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemUsersIdUsingDeleteResponse>(
    `/api/admin/system/users/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新系统用户 PATCH /api/admin/system/users/${param0} */
export async function systemUsersIdUsingPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUsersIdUsingPatchParams;
  body: API.SystemUsersIdUsingPatchBody;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemUsersIdUsingPatchResponse>(
    `/api/admin/system/users/${param0}`,
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

/** 给用户添加角色 POST /api/admin/system/users/${param0}/roles */
export async function systemUsersUserIdRolesUsingPost({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUsersUserIdRolesUsingPostParams;
  body: API.SystemUsersUserIdRolesUsingPostBody;
  options?: CustomRequestOptions;
}) {
  const { userId: param0, ...queryParams } = params;

  return request<API.SystemUsersUserIdRolesUsingPostResponse>(
    `/api/admin/system/users/${param0}/roles`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}

/** 批量删除用户角色 DELETE /api/admin/system/users/${param0}/roles */
export async function systemUsersUserIdRolesUsingDelete({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUsersUserIdRolesUsingDeleteParams;
  body: API.SystemUsersUserIdRolesUsingDeleteBody;
  options?: CustomRequestOptions;
}) {
  const { userId: param0, ...queryParams } = params;

  return request<API.SystemUsersUserIdRolesUsingDeleteResponse>(
    `/api/admin/system/users/${param0}/roles`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    }
  );
}
