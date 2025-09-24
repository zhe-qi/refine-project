/* eslint-disable */
// @ts-ignore
import { queryOptions, useMutation } from '@tanstack/react-query';
import type { DefaultError } from '@tanstack/react-query';
import { request } from '@/api/request';

import * as apis from './rolexitongjiaose';
import * as API from './types';

/** 获取系统角色列表 GET /api/admin/system/role */
export function systemRoleUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRoleUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.systemRoleUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['systemRoleUsingGet', options],
  });
}

/** 创建系统角色 POST /api/admin/system/role */
export function useSystemRoleUsingPostMutation(options?: {
  onSuccess?: (value?: API.SystemRoleUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemRoleUsingPost,
    onSuccess(data: API.SystemRoleUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 获取系统角色详情 GET /api/admin/system/role/${param0} */
export function systemRoleIdUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRoleIdUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.systemRoleIdUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['systemRoleIdUsingGet', options],
  });
}

/** 删除系统角色 DELETE /api/admin/system/role/${param0} */
export function useSystemRoleIdUsingDeleteMutation(options?: {
  onSuccess?: (value?: API.SystemRoleIdUsingDeleteResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemRoleIdUsingDelete,
    onSuccess(data: API.SystemRoleIdUsingDeleteResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 更新系统角色 PATCH /api/admin/system/role/${param0} */
export function useSystemRoleIdUsingPatchMutation(options?: {
  onSuccess?: (value?: API.SystemRoleIdUsingPatchResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemRoleIdUsingPatch,
    onSuccess(data: API.SystemRoleIdUsingPatchResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 获取角色权限 GET /api/admin/system/role/${param0}/permissions */
export function systemRoleIdPermissionsUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemRoleIdPermissionsUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.systemRoleIdPermissionsUsingGet(
        queryKey[1] as typeof options
      );
    },
    queryKey: ['systemRoleIdPermissionsUsingGet', options],
  });
}

/** 保存角色权限（全量更新） PUT /api/admin/system/role/${param0}/permissions */
export function useSystemRoleIdPermissionsUsingPutMutation(options?: {
  onSuccess?: (value?: API.SystemRoleIdPermissionsUsingPutResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemRoleIdPermissionsUsingPut,
    onSuccess(data: API.SystemRoleIdPermissionsUsingPutResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}
