/* eslint-disable */
// @ts-ignore
import { queryOptions, useMutation } from '@tanstack/react-query';
import type { DefaultError } from '@tanstack/react-query';
import { request } from '@/api/request';

import * as apis from './authguanliduanshenfenrenzheng';
import * as API from './types';

/** 管理端生成验证码挑战 POST /api/admin/auth/challenge */
export function useAuthChallengeUsingPostMutation(options?: {
  onSuccess?: (value?: API.AuthChallengeUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.authChallengeUsingPost,
    onSuccess(data: API.AuthChallengeUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 管理端登录 POST /api/admin/auth/login */
export function useAuthLoginUsingPostMutation(options?: {
  onSuccess?: (value?: API.AuthLoginUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.authLoginUsingPost,
    onSuccess(data: API.AuthLoginUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 管理端退出登录 POST /api/admin/auth/logout */
export function useAuthLogoutUsingPostMutation(options?: {
  onSuccess?: (value?: API.AuthLogoutUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.authLogoutUsingPost,
    onSuccess(data: API.AuthLogoutUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 管理端获取当前用户权限 GET /api/admin/auth/permissions */
export function authPermissionsUsingGetQueryOptions(options: {
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.authPermissionsUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['authPermissionsUsingGet', options],
  });
}

/** 管理端验证用户解答 POST /api/admin/auth/redeem */
export function useAuthRedeemUsingPostMutation(options?: {
  onSuccess?: (value?: API.AuthRedeemUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.authRedeemUsingPost,
    onSuccess(data: API.AuthRedeemUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 管理端刷新访问令牌 POST /api/admin/auth/refresh */
export function useAuthRefreshUsingPostMutation(options?: {
  onSuccess?: (value?: API.AuthRefreshUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.authRefreshUsingPost,
    onSuccess(data: API.AuthRefreshUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 管理端获取当前用户信息 GET /api/admin/auth/userinfo */
export function authUserinfoUsingGetQueryOptions(options: {
  options?: CustomRequestOptions;
}) {
  return queryOptions({
    queryFn: async ({ queryKey }) => {
      return apis.authUserinfoUsingGet(queryKey[1] as typeof options);
    },
    queryKey: ['authUserinfoUsingGet', options],
  });
}
