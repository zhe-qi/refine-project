/* eslint-disable */
// @ts-ignore
import { queryOptions, useMutation } from '@tanstack/react-query';
import type { DefaultError } from '@tanstack/react-query';
import { request } from '@/api/request';

import * as apis from './rolesxitongjiaose';
import * as API from './types';

/** 获取系统角色列表 GET /api/admin/system/roles */
export function systemRolesUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRolesUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.systemRolesUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['systemRolesUsingGet', options],
  });
}

/** 创建系统角色 POST /api/admin/system/roles */
export function useSystemRolesUsingPostMutation(options?: {
  onSuccess?: (value?: API.SystemRolesUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemRolesUsingPost,
    onSuccess(data: API.SystemRolesUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 获取系统角色详情 GET /api/admin/system/roles/${param0} */
export function systemRolesIdUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRolesIdUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.systemRolesIdUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['systemRolesIdUsingGet', options],
  });
}

/** 删除系统角色 DELETE /api/admin/system/roles/${param0} */
export function useSystemRolesIdUsingDeleteMutation(options?: {
  onSuccess?: (value?: API.SystemRolesIdUsingDeleteResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemRolesIdUsingDelete,
    onSuccess(data: API.SystemRolesIdUsingDeleteResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 更新系统角色 PATCH /api/admin/system/roles/${param0} */
export function useSystemRolesIdUsingPatchMutation(options?: {
  onSuccess?: (value?: API.SystemRolesIdUsingPatchResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemRolesIdUsingPatch,
    onSuccess(data: API.SystemRolesIdUsingPatchResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 获取角色权限 GET /api/admin/system/roles/${param0}/permissions */
export function systemRolesIdPermissionsUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRolesIdPermissionsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.systemRolesIdPermissionsUsingGet(
        queryKey[1] as typeof options
      );
    },
    queryKey: ['systemRolesIdPermissionsUsingGet', options],
  });
}

/** 保存角色权限（全量更新） PUT /api/admin/system/roles/${param0}/permissions */
export function useSystemRolesIdPermissionsUsingPutMutation(options?: {
  onSuccess?: (value?: API.SystemRolesIdPermissionsUsingPutResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemRolesIdPermissionsUsingPut,
    onSuccess(data: API.SystemRolesIdPermissionsUsingPutResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}
