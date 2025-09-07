/* eslint-disable */
// @ts-ignore
import { queryOptions, useMutation } from '@tanstack/react-query';
import type { DefaultError } from '@tanstack/react-query';
import { request } from '@/api/request';

import * as apis from './usersxitongyonghu';
import * as API from './types';

/** 获取系统用户列表 GET /api/admin/system/users */
export function systemUsersUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUsersUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.systemUsersUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['systemUsersUsingGet', options],
  });
}

/** 创建系统用户 POST /api/admin/system/users */
export function useSystemUsersUsingPostMutation(options?: {
  onSuccess?: (value?: API.SystemUsersUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemUsersUsingPost,
    onSuccess(data: API.SystemUsersUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 获取系统用户详情 GET /api/admin/system/users/${param0} */
export function systemUsersIdUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUsersIdUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.systemUsersIdUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['systemUsersIdUsingGet', options],
  });
}

/** 删除系统用户 DELETE /api/admin/system/users/${param0} */
export function useSystemUsersIdUsingDeleteMutation(options?: {
  onSuccess?: (value?: API.SystemUsersIdUsingDeleteResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemUsersIdUsingDelete,
    onSuccess(data: API.SystemUsersIdUsingDeleteResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 更新系统用户 PATCH /api/admin/system/users/${param0} */
export function useSystemUsersIdUsingPatchMutation(options?: {
  onSuccess?: (value?: API.SystemUsersIdUsingPatchResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemUsersIdUsingPatch,
    onSuccess(data: API.SystemUsersIdUsingPatchResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 保存用户角色（全量更新） PUT /api/admin/system/users/${param0}/roles */
export function useSystemUsersUserIdRolesUsingPutMutation(options?: {
  onSuccess?: (value?: API.SystemUsersUserIdRolesUsingPutResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemUsersUserIdRolesUsingPut,
    onSuccess(data: API.SystemUsersUserIdRolesUsingPutResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}
