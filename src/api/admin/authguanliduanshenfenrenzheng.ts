/* eslint-disable */
// @ts-ignore
import { request } from '@/api/request';

import * as API from './types';

/** 管理端生成验证码挑战 POST /api/admin/auth/challenge */
export async function authChallengeUsingPost({
  options,
}: {
  options?: CustomRequestOptions;
}) {
  return request<API.AuthChallengeUsingPostResponse>(
    '/api/admin/auth/challenge',
    {
      method: 'POST',
      ...(options || {}),
    }
  );
}

/** 管理端登录 POST /api/admin/auth/login */
export async function authLoginUsingPost({
  body,
  options,
}: {
  body: API.AuthLoginUsingPostBody;
  options?: CustomRequestOptions;
}) {
  return request<API.AuthLoginUsingPostResponse>('/api/admin/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理端退出登录 POST /api/admin/auth/logout */
export async function authLogoutUsingPost({
  options,
}: {
  options?: CustomRequestOptions;
}) {
  return request<API.AuthLogoutUsingPostResponse>('/api/admin/auth/logout', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 管理端获取当前用户权限 GET /api/admin/auth/permissions */
export async function authPermissionsUsingGet({
  options,
}: {
  options?: CustomRequestOptions;
}) {
  return request<API.AuthPermissionsUsingGetResponse>(
    '/api/admin/auth/permissions',
    {
      method: 'GET',
      ...(options || {}),
    }
  );
}

/** 管理端验证用户解答 POST /api/admin/auth/redeem */
export async function authRedeemUsingPost({
  body,
  options,
}: {
  body: API.AuthRedeemUsingPostBody;
  options?: CustomRequestOptions;
}) {
  return request<API.AuthRedeemUsingPostResponse>('/api/admin/auth/redeem', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 管理端刷新访问令牌 POST /api/admin/auth/refresh */
export async function authRefreshUsingPost({
  options,
}: {
  options?: CustomRequestOptions;
}) {
  return request<API.AuthRefreshUsingPostResponse>('/api/admin/auth/refresh', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 管理端获取当前用户信息 GET /api/admin/auth/userinfo */
export async function authUserinfoUsingGet({
  options,
}: {
  options?: CustomRequestOptions;
}) {
  return request<API.AuthUserinfoUsingGetResponse>('/api/admin/auth/userinfo', {
    method: 'GET',
    ...(options || {}),
  });
}
