/* eslint-disable */
// @ts-ignore
import { request } from '@/api/request';

import * as API from './types';

/** 获取系统角色列表 GET /api/admin/system/roles */
export async function systemRolesUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRolesUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return request<API.SystemRolesUsingGetResponse>('/api/admin/system/roles', {
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

/** 创建系统角色 POST /api/admin/system/roles */
export async function systemRolesUsingPost({
  body,
  options,
}: {
  body: API.SystemRolesUsingPostBody;
  options?: CustomRequestOptions;
}) {
  return request<API.SystemRolesUsingPostResponse>('/api/admin/system/roles', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取系统角色详情 GET /api/admin/system/roles/${param0} */
export async function systemRolesIdUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRolesIdUsingGetParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemRolesIdUsingGetResponse>(
    `/api/admin/system/roles/${param0}`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 删除系统角色 DELETE /api/admin/system/roles/${param0} */
export async function systemRolesIdUsingDelete({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRolesIdUsingDeleteParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemRolesIdUsingDeleteResponse>(
    `/api/admin/system/roles/${param0}`,
    {
      method: 'DELETE',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 更新系统角色 PATCH /api/admin/system/roles/${param0} */
export async function systemRolesIdUsingPatch({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRolesIdUsingPatchParams;
  body: API.SystemRolesIdUsingPatchBody;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemRolesIdUsingPatchResponse>(
    `/api/admin/system/roles/${param0}`,
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

/** 获取角色权限 GET /api/admin/system/roles/${param0}/permissions */
export async function systemRolesIdPermissionsUsingGet({
  params,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRolesIdPermissionsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemRolesIdPermissionsUsingGetResponse>(
    `/api/admin/system/roles/${param0}/permissions`,
    {
      method: 'GET',
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}

/** 保存角色权限（全量更新） PUT /api/admin/system/roles/${param0}/permissions */
export async function systemRolesIdPermissionsUsingPut({
  params,
  body,
  options,
}: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRolesIdPermissionsUsingPutParams;
  body: API.SystemRolesIdPermissionsUsingPutBody;
  options?: CustomRequestOptions;
}) {
  const { id: param0, ...queryParams } = params;

  return request<API.SystemRolesIdPermissionsUsingPutResponse>(
    `/api/admin/system/roles/${param0}/permissions`,
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
