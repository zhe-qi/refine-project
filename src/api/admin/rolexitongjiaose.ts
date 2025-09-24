/* eslint-disable */
// @ts-ignore
import { request } from '@/api/request';

import * as API from './types';

/** 获取系统角色列表 GET /api/admin/system/role */
export async function systemRoleUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRoleUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return request<API.SystemRoleUsingGetResponse>('/api/admin/system/role', {
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

/** 创建系统角色 POST /api/admin/system/role */
export async function systemRoleUsingPost({
  body,
  options,
}: {
  body: API.SystemRoleUsingPostBody;
  options?: CustomRequestOptions;
}) {
  return request<API.SystemRoleUsingPostResponse>('/api/admin/system/role', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取系统角色详情 GET /api/admin/system/role/${param0} */
export async function systemRoleIdUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRoleIdUsingGetParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemRoleIdUsingGetResponse>(
    `/api/admin/system/role/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除系统角色 DELETE /api/admin/system/role/${param0} */
export async function systemRoleIdUsingDelete({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRoleIdUsingDeleteParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemRoleIdUsingDeleteResponse>(
    `/api/admin/system/role/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新系统角色 PATCH /api/admin/system/role/${param0} */
export async function systemRoleIdUsingPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRoleIdUsingPatchParams;
  body: API.SystemRoleIdUsingPatchBody;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemRoleIdUsingPatchResponse>(
    `/api/admin/system/role/${param0}`,
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

/** 获取角色权限 GET /api/admin/system/role/${param0}/permissions */
export async function systemRoleIdPermissionsUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRoleIdPermissionsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemRoleIdPermissionsUsingGetResponse>(
    `/api/admin/system/role/${param0}/permissions`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 保存角色权限（全量更新） PUT /api/admin/system/role/${param0}/permissions */
export async function systemRoleIdPermissionsUsingPut({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRoleIdPermissionsUsingPutParams;
  body: API.SystemRoleIdPermissionsUsingPutBody;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemRoleIdPermissionsUsingPutResponse>(
    `/api/admin/system/role/${param0}/permissions`,
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
