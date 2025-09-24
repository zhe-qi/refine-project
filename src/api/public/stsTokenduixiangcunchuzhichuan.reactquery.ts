/* eslint-disable */
// @ts-ignore
import { queryOptions, useMutation } from '@tanstack/react-query';
import type { DefaultError } from '@tanstack/react-query';
import { request } from '@/api/request';

import * as apis from './stsTokenduixiangcunchuzhichuan';
import * as API from './types';

/** 获取下载预签名 URL 请在请求头携带 X-Request-Source: admin 或 client POST /api/sts-token/download */
export function useDownloadUsingPostMutation(options?: {
  onSuccess?: (value?: API.DownloadUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.downloadUsingPost,
    onSuccess(data: API.DownloadUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}

/** 获取上传预签名 URL 请在请求头携带 X-Request-Source: admin 或 client POST /api/sts-token/upload */
export function useUploadUsingPostMutation(options?: {
  onSuccess?: (value?: API.UploadUsingPostResponse) => void;
  onError?: (error?: DefaultError) => void;
}) {
  const { onSuccess, onError } = options || {};

  const response = useMutation({
    mutationFn: apis.uploadUsingPost,
    onSuccess(data: API.UploadUsingPostResponse) {
      onSuccess?.(data);
    },
    onError(error) {
      onError?.(error);
    },
  });

  return response;
}
