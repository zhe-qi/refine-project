/**
 * Cloudflare R2 对象存储直传工具
 * 基于预签名URL实现客户端直传，减少服务器压力
 */

import { uploadUsingPost } from '@/api/public/stsTokenduixiangcunchuzhichuan';
import type { UploadUsingPostResponse } from '@/api/public/types';
import { generateUniqueFileName, validateFileType, validateFileSize, UPLOAD_ERROR_MESSAGES } from '@/config/upload';
import type { R2UploadOptions, R2UploadResult } from '@/types/r2-upload';

// 上传进度回调类型
export type UploadProgressCallback = (progress: number) => void;

/** 错误代码常量 */
export const R2_UPLOAD_ERROR_CODES = {
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  FILE_TYPE_NOT_SUPPORTED: 'FILE_TYPE_NOT_SUPPORTED', 
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  FILE_COUNT_EXCEEDED: 'FILE_COUNT_EXCEEDED',
  INVALID_FILE: 'INVALID_FILE',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
} as const;

/** 错误代码类型 */
export type R2UploadErrorCode = (typeof R2_UPLOAD_ERROR_CODES)[keyof typeof R2_UPLOAD_ERROR_CODES];

/** R2上传错误类 */
export class R2UploadError extends Error {
  constructor(
    message: string,
    public code: R2UploadErrorCode,
    public details?: any
  ) {
    super(message);
    this.name = 'R2UploadError';
  }
}

/**
 * 验证文件
 * @param file 文件对象
 * @param options 验证选项
 */
const validateFile = (file: File, options: R2UploadOptions & { file: File }): void => {
  // 验证文件是否存在
  if (!file) {
    throw new R2UploadError(UPLOAD_ERROR_MESSAGES.INVALID_FILE, R2_UPLOAD_ERROR_CODES.INVALID_FILE);
  }

  // 验证文件大小
  if (options.maxSize && !validateFileSize(file, options.maxSize)) {
    throw new R2UploadError(
      `${UPLOAD_ERROR_MESSAGES.FILE_TOO_LARGE}（最大 ${(options.maxSize / 1024 / 1024).toFixed(1)}MB）`,
      R2_UPLOAD_ERROR_CODES.FILE_TOO_LARGE,
      { fileSize: file.size, maxSize: options.maxSize }
    );
  }

  // 验证文件类型
  if (options.allowedTypes && !validateFileType(file, options.allowedTypes)) {
    throw new R2UploadError(
      `${UPLOAD_ERROR_MESSAGES.FILE_TYPE_NOT_SUPPORTED}（${file.type}）`,
      R2_UPLOAD_ERROR_CODES.FILE_TYPE_NOT_SUPPORTED,
      { fileType: file.type, allowedTypes: options.allowedTypes }
    );
  }
};

/**
 * 获取预签名上传URL
 * @param fileName 文件名
 * @param fileType 文件类型
 */
const getPresignedUploadUrl = async (
  fileName: string, 
  fileType?: string
): Promise<UploadUsingPostResponse> => {
  try {
    const response = await uploadUsingPost({
      body: {
        fileName,
        fileType
      },
      options: {
        headers: {
          'X-Request-Source': 'admin'
        }
      }
    });
    
    return response;
  } catch (error) {
    console.error('获取预签名URL失败:', error);
    throw new R2UploadError(
      UPLOAD_ERROR_MESSAGES.TOKEN_EXPIRED,
      R2_UPLOAD_ERROR_CODES.TOKEN_EXPIRED,
      error
    );
  }
};

/**
 * 使用预签名URL直接上传文件到R2 (兼容性改进版)
 * @param file 文件对象
 * @param presignedUrl 预签名URL
 * @param onProgress 进度回调
 */
const uploadFileToR2 = (
  file: File,
  presignedUrl: string,
  onProgress?: UploadProgressCallback
): Promise<void> => {
  return new Promise((resolve, reject) => {
    console.log('开始上传到R2:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      presignedUrl: presignedUrl.split('?')[0],
    });

    // 使用XMLHttpRequest以获得更好的兼容性和控制
    const xhr = new XMLHttpRequest();

    // 上传进度处理
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        console.log(`上传进度: ${progress}%`);
        onProgress?.(progress);
      }
    });

    // 请求完成处理
    xhr.addEventListener('load', () => {
      console.log('XMLHttpRequest完成:', {
        status: xhr.status,
        statusText: xhr.statusText,
        responseHeaders: xhr.getAllResponseHeaders(),
      });

      if (xhr.status >= 200 && xhr.status < 300) {
        console.log('R2上传成功!');
        resolve();
      } else {
        console.error('R2上传失败:', {
          status: xhr.status,
          statusText: xhr.statusText,
          response: xhr.responseText
        });
        reject(new R2UploadError(
          `上传失败: ${xhr.status} ${xhr.statusText}`,
          R2_UPLOAD_ERROR_CODES.UPLOAD_FAILED,
          { status: xhr.status, response: xhr.responseText }
        ));
      }
    });

    // 错误处理
    xhr.addEventListener('error', (error) => {
      console.error('XMLHttpRequest错误:', error);
      reject(new R2UploadError(
        '网络错误，无法连接到云存储服务',
        R2_UPLOAD_ERROR_CODES.NETWORK_ERROR,
        error
      ));
    });

    // 超时处理
    xhr.addEventListener('timeout', () => {
      console.error('XMLHttpRequest超时');
      reject(new R2UploadError(
        '上传超时，请检查网络连接',
        R2_UPLOAD_ERROR_CODES.NETWORK_ERROR,
        { reason: 'timeout' }
      ));
    });

    // 中断处理
    xhr.addEventListener('abort', () => {
      console.error('XMLHttpRequest被中断');
      reject(new R2UploadError(
        '上传被中断',
        R2_UPLOAD_ERROR_CODES.UPLOAD_FAILED,
        { reason: 'abort' }
      ));
    });

    try {
      // 配置请求
      xhr.open('PUT', presignedUrl, true);
      xhr.timeout = 60000; // 60秒超时
      
      // 设置必要的请求头
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      
      console.log('发送XMLHttpRequest PUT请求...');
      console.log('请求URL:', presignedUrl.split('?')[0]);
      console.log('Content-Type:', file.type || 'application/octet-stream');
      
      // 发送文件
      xhr.send(file);
      
    } catch (error) {
      console.error('XMLHttpRequest初始化失败:', error);
      reject(new R2UploadError(
        '请求初始化失败',
        R2_UPLOAD_ERROR_CODES.UNKNOWN_ERROR,
        error
      ));
    }
  });
};

/**
 * 构建最终的文件访问URL
 * @param presignedUrl 预签名URL
 * @param fileName 文件名
 */
const buildFinalUrl = (presignedUrl: string, fileName: string): string => {
  // 从预签名URL中提取基础URL（去除查询参数）
  const url = new URL(presignedUrl);
  return `${url.origin}${url.pathname}`;
};

/**
 * R2 对象存储文件上传主函数 (改进版)
 * @param options 上传选项
 * @returns 上传结果
 */
export const uploadToR2 = async (options: R2UploadOptions & { file: File }): Promise<R2UploadResult> => {
  const startTime = Date.now();
  
  try {
    const { file, onProgress } = options;
    
    console.log('开始R2上传流程:', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      options: { ...options, file: '[File Object]' }
    });

    // 1. 验证文件
    onProgress?.(1);
    validateFile(file, options);
    console.log('文件验证通过');

    // 2. 确定文件名
    let fileName = options.fileName || file.name;
    if (options.generateUniqueName !== false) {
      fileName = generateUniqueFileName(fileName);
    }
    console.log('生成文件名:', fileName);

    // 3. 获取预签名上传URL
    onProgress?.(5);
    console.log('获取预签名URL...');
    const { url: presignedUrl } = await getPresignedUploadUrl(fileName, file.type);
    console.log('获取预签名URL成功:', presignedUrl.split('?')[0]);
    
    onProgress?.(10);

    // 4. 上传文件到R2
    console.log('开始上传文件到R2...');
    await uploadFileToR2(file, presignedUrl, (progress) => {
      const mappedProgress = 10 + (progress * 0.85);
      onProgress?.(Math.round(mappedProgress));
    });

    onProgress?.(100);

    // 5. 构建最终结果
    const finalUrl = buildFinalUrl(presignedUrl, fileName);
    const result: R2UploadResult = {
      url: finalUrl,
      fileName,
      fileSize: file.size,
      fileType: file.type,
      duration: Date.now() - startTime
    };

    console.log('R2上传流程完成:', result);
    return result;
    
  } catch (error) {
    console.error('R2上传流程失败:', error);
    
    // 确保错误是 R2UploadError 类型
    if (error instanceof R2UploadError) {
      throw error;
    }
    
    // 包装未知错误
    throw new R2UploadError(
      UPLOAD_ERROR_MESSAGES.UPLOAD_FAILED,
      R2_UPLOAD_ERROR_CODES.UNKNOWN_ERROR,
      error
    );
  }
};

/**
 * 批量上传文件到R2
 * @param files 文件数组
 * @param baseOptions 基础上传选项
 * @param onProgress 整体进度回调 (当前文件索引, 总文件数, 当前文件进度)
 */
export const uploadMultipleToR2 = async (
  files: File[],
  baseOptions: Omit<R2UploadOptions, 'file' | 'onProgress'> = {},
  onProgress?: (current: number, total: number, fileProgress: number) => void
): Promise<R2UploadResult[]> => {
  const results: R2UploadResult[] = [];
  const total = files.length;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    
    try {
      const result = await uploadToR2({
        ...baseOptions,
        file,
        onProgress: (progress) => {
          onProgress?.(i + 1, total, progress);
        }
      });
      
      results.push(result);
    } catch (error) {
      // 批量上传时，单个文件失败不影响其他文件
      console.error(`文件 ${file.name} 上传失败:`, error);
      throw error; // 重新抛出错误，让调用方决定如何处理
    }
  }

  return results;
};

// R2UploadError 类已经在上面导出了，这里只需要导出 UPLOAD_ERROR_MESSAGES
export { UPLOAD_ERROR_MESSAGES };