/* eslint-disable */
// @ts-ignore
import { request } from '@/api/request';

import * as API from './types';

/** 获取下载预签名 URL，请在请求头携带 X-Request-Source: admin 或 client POST /api/sts-token/download */
export async function downloadUsingPost({
  body,
  options,
}: {
  body: API.DownloadUsingPostBody;
  options?: CustomRequestOptions;
}) {
  return request<API.DownloadUsingPostResponse>('/api/sts-token/download', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 获取上传预签名 URL，请在请求头携带 X-Request-Source: admin 或 client POST /api/sts-token/upload */
export async function uploadUsingPost({
  body,
  options,
}: {
  body: API.UploadUsingPostBody;
  options?: CustomRequestOptions;
}) {
  return request<API.UploadUsingPostResponse>('/api/sts-token/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
