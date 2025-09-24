/* eslint-disable */
// @ts-ignore
import { queryOptions, useMutation } from '@tanstack/react-query';
import type { DefaultError } from '@tanstack/react-query';
import { request } from '@/api/request';

import * as apis from './userxitongyonghu';
import * as API from './types';

/** 获取系统用户列表 GET /api/admin/system/user */
export function systemUserUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUserUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.systemUserUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['systemUserUsingGet', options],
  });
}

/** 创建系统用户 POST /api/admin/system/user */
export function useSystemUserUsingPostMutation(options?: {
  onSuccess?: (value?: API.SystemUserUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemUserUsingPost,
    onSuccess(data: API.SystemUserUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 获取系统用户详情 GET /api/admin/system/user/${param0} */
export function systemUserIdUsingGetQueryOptions(options: {
  // 叠加生成的Param类型 (非body参数openapi默认没有生成对象)
  params: API.SystemUserIdUsingGetParams;
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.systemUserIdUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['systemUserIdUsingGet', options],
  });
}

/** 删除系统用户 DELETE /api/admin/system/user/${param0} */
export function useSystemUserIdUsingDeleteMutation(options?: {
  onSuccess?: (value?: API.SystemUserIdUsingDeleteResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemUserIdUsingDelete,
    onSuccess(data: API.SystemUserIdUsingDeleteResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 更新系统用户 PATCH /api/admin/system/user/${param0} */
export function useSystemUserIdUsingPatchMutation(options?: {
  onSuccess?: (value?: API.SystemUserIdUsingPatchResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemUserIdUsingPatch,
    onSuccess(data: API.SystemUserIdUsingPatchResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 保存用户角色（全量更新） PUT /api/admin/system/user/${param0}/roles */
export function useSystemUserUserIdRolesUsingPutMutation(options?: {
  onSuccess?: (value?: API.SystemUserUserIdRolesUsingPutResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.systemUserUserIdRolesUsingPut,
    onSuccess(data: API.SystemUserUserIdRolesUsingPutResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}
