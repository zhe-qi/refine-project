/* eslint-disable */
// @ts-ignore

export type DownloadUsingPostBody = {
  /** 文件名 */
  fileName: string;
};

export type DownloadUsingPostResponse = {
  /** 预签名 URL */
  url: string;
  /** 过期时间 */
  expiresAt: string;
};

export type UploadUsingPostBody = {
  /** 文件名 */
  fileName: string;
  /** 文件类型 */
  fileType?: string;
};

export type UploadUsingPostResponse = {
  /** 预签名 URL */
  url: string;
  /** 过期时间 */
  expiresAt: string;
};
