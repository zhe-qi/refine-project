/**
 * R2 对象存储上传 React Hook
 * 为 Refine 应用提供完整的文件上传解决方案
 */

import { useState, useCallback, useMemo } from 'react';
import { useNotification } from '@refinedev/core';
import type { UploadProps, UploadFile } from 'antd';
import { uploadToR2, uploadMultipleToR2, R2UploadError, R2_UPLOAD_ERROR_CODES } from '@/utils/r2-upload';
import type { R2UploadResult, R2UploadOptions } from '@/types/r2-upload';
import { DEFAULT_UPLOAD_CONFIG, FILE_TYPE_PRESETS, formatFileSize } from '@/config/upload';

// Hook 配置选项
export interface UseR2UploadOptions extends Omit<R2UploadOptions, 'file' | 'onProgress'> {
  /** 最大上传文件数量 */
  maxCount?: number;
  /** 是否支持多文件上传 */
  multiple?: boolean;
  /** 文件类型预设 */
  preset?: keyof typeof FILE_TYPE_PRESETS;
  /** 文件用途类型：用于区分不同用途的上传 */
  fileUsage?: 'avatar' | 'document' | 'image' | 'file' | 'general';
  /** 上传成功回调 */
  onSuccess?: (result: R2UploadResult, file: File) => void;
  /** 上传失败回调 */
  onError?: (error: R2UploadError, file: File) => void;
  /** 是否显示通知 */
  showNotification?: boolean;
  /** 自定义Accept属性 */
  accept?: string;
}

// 上传状态
export interface UploadState {
  /** 是否正在上传 */
  uploading: boolean;
  /** 上传进度 (0-100) */
  progress: number;
  /** 已上传完成的文件列表 */
  fileList: UploadFile[];
  /** 上传结果列表 */
  results: R2UploadResult[];
  /** 错误信息 */
  error: R2UploadError | null;
}

// Hook 返回值
export interface UseR2UploadReturn extends UploadState {
  /** 兼容 Ant Design Upload 组件的属性 */
  uploadProps: UploadProps;
  /** 手动上传文件 */
  upload: (file: File) => Promise<R2UploadResult>;
  /** 批量上传文件 */
  uploadMultiple: (files: File[]) => Promise<R2UploadResult[]>;
  /** 清空文件列表 */
  clearFiles: () => void;
  /** 移除指定文件 */
  removeFile: (uid: string) => void;
  /** 重置上传状态 */
  reset: () => void;
}

/**
 * R2 上传 Hook
 * @param options 配置选项
 * @returns Hook 返回值
 */
export const useR2Upload = (options: UseR2UploadOptions = {}): UseR2UploadReturn => {
  const { open } = useNotification();
  
  // 解构配置选项
  const {
    maxCount = DEFAULT_UPLOAD_CONFIG.maxCount,
    multiple = DEFAULT_UPLOAD_CONFIG.multiple,
    preset = 'all',
    fileUsage = 'general',
    onSuccess,
    onError,
    showNotification = true,
    accept,
    ...uploadOptions
  } = options;

  // 获取预设配置
  const presetConfig = FILE_TYPE_PRESETS[preset];
  
  // 状态管理
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    fileList: [],
    results: [],
    error: null,
  });

  // 更新状态的辅助函数
  const updateState = useCallback((updates: Partial<UploadState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // 显示通知
  const showNotificationMessage = useCallback((type: 'success' | 'error', message: string, description?: string) => {
    if (showNotification) {
      open?.({
        type,
        message,
        description,
      });
    }
  }, [open, showNotification]);

  // 转换文件为 UploadFile 格式
  const fileToUploadFile = useCallback((file: File, result?: R2UploadResult, status: UploadFile['status'] = 'done'): UploadFile => {
    return {
      uid: `${Date.now()}-${Math.random()}`,
      name: file.name,
      size: file.size,
      type: file.type,
      status,
      url: result?.url,
      response: result,
      originFileObj: file,
    };
  }, []);

  // 单文件上传
  const upload = useCallback(async (file: File): Promise<R2UploadResult> => {
    updateState({ uploading: true, progress: 0, error: null });

    try {
      const result = await uploadToR2({
        ...uploadOptions,
        file,
        allowedTypes: presetConfig.extensions ? undefined : presetConfig.accept?.split(','),
        maxSize: uploadOptions.maxSize || presetConfig.maxSize,
        onProgress: (progress) => {
          updateState({ progress });
        }
      });

      // 更新文件列表和结果
      const uploadFile = fileToUploadFile(file, result, 'done');
      updateState({
        uploading: false,
        progress: 100,
        fileList: prev => [...prev, uploadFile],
        results: prev => [...prev, result],
      });

      // 执行回调和通知
      onSuccess?.(result, file);
      showNotificationMessage('success', '文件上传成功', `${file.name} 上传完成`);

      return result;
    } catch (error) {
      const uploadError = error instanceof R2UploadError ? error : new R2UploadError('上传失败', 'UNKNOWN_ERROR', error);
      
      // 更新错误状态
      const uploadFile = fileToUploadFile(file, undefined, 'error');
      updateState({
        uploading: false,
        progress: 0,
        error: uploadError,
        fileList: prev => [...prev, uploadFile],
      });

      // 执行回调和通知
      onError?.(uploadError, file);
      showNotificationMessage('error', '文件上传失败', `${file.name}: ${uploadError.message}`);

      throw uploadError;
    }
  }, [uploadOptions, presetConfig, fileToUploadFile, updateState, onSuccess, onError, showNotificationMessage]);

  // 批量上传
  const uploadMultiple = useCallback(async (files: File[]): Promise<R2UploadResult[]> => {
    if (files.length === 0) return [];

    updateState({ uploading: true, progress: 0, error: null });

    try {
      const results = await uploadMultipleToR2(
        files,
        {
          ...uploadOptions,
          allowedTypes: presetConfig.extensions ? undefined : presetConfig.accept?.split(','),
          maxSize: uploadOptions.maxSize || presetConfig.maxSize,
        },
        (current, total, fileProgress) => {
          // 计算整体进度
          const overallProgress = Math.round(((current - 1) / total) * 100 + (fileProgress / total));
          updateState({ progress: overallProgress });
        }
      );

      // 更新文件列表和结果
      const uploadFiles = files.map((file, index) => 
        fileToUploadFile(file, results[index], 'done')
      );
      
      updateState({
        uploading: false,
        progress: 100,
        fileList: prev => [...prev, ...uploadFiles],
        results: prev => [...prev, ...results],
      });

      // 显示成功通知
      showNotificationMessage('success', '批量上传完成', `成功上传 ${results.length} 个文件`);

      // 执行成功回调
      results.forEach((result, index) => {
        onSuccess?.(result, files[index]);
      });

      return results;
    } catch (error) {
      const uploadError = error instanceof R2UploadError ? error : new R2UploadError('批量上传失败', 'UNKNOWN_ERROR', error);
      
      updateState({
        uploading: false,
        progress: 0,
        error: uploadError,
      });

      showNotificationMessage('error', '批量上传失败', uploadError.message);
      throw uploadError;
    }
  }, [uploadOptions, presetConfig, fileToUploadFile, updateState, showNotificationMessage, onSuccess]);

  // 清空文件列表
  const clearFiles = useCallback(() => {
    updateState({
      fileList: [],
      results: [],
      error: null,
      progress: 0,
    });
  }, [updateState]);

  // 移除指定文件
  const removeFile = useCallback((uid: string) => {
    updateState({
      fileList: prev => prev.filter(file => file.uid !== uid),
      results: prev => prev.filter((_, index) => state.fileList[index]?.uid !== uid),
    });
  }, [updateState, state.fileList]);

  // 重置状态
  const reset = useCallback(() => {
    setState({
      uploading: false,
      progress: 0,
      fileList: [],
      results: [],
      error: null,
    });
  }, []);

  // 构建 Ant Design Upload 组件的 props
  const uploadProps: UploadProps = useMemo(() => ({
    // 基本属性
    multiple,
    maxCount,
    accept: accept || presetConfig.accept,
    fileList: state.fileList,
    
    // 自定义上传逻辑
    customRequest: async ({ file, onProgress, onSuccess: onAntdSuccess, onError: onAntdError }) => {
      try {
        if (file instanceof File) {
          updateState({ uploading: true, progress: 0, error: null });
          
          const result = await uploadToR2({
            ...uploadOptions,
            file,
            allowedTypes: presetConfig.extensions ? undefined : presetConfig.accept?.split(','),
            maxSize: uploadOptions.maxSize || presetConfig.maxSize,
            onProgress: (progress) => {
              onProgress?.({ percent: progress });
              updateState({ progress });
            }
          });
          
          // 创建 UploadFile 对象
          const uploadFile = fileToUploadFile(file, result, 'done');
          
          // 更新状态
          updateState({
            uploading: false,
            progress: 100,
            fileList: prev => [...prev.filter(f => f.uid !== uploadFile.uid), uploadFile],
            results: prev => [...prev, result],
          });
          
          // 执行回调
          onSuccess?.(result, file);
          onAntdSuccess?.(result);
          showNotificationMessage('success', '上传成功', `${file.name} 上传完成`);
        }
      } catch (error) {
        const uploadError = error instanceof R2UploadError ? error : new R2UploadError('上传失败', R2_UPLOAD_ERROR_CODES.UNKNOWN_ERROR, error);
        
        // 创建失败的 UploadFile 对象
        const uploadFile = fileToUploadFile(file as File, undefined, 'error');
        
        updateState({
          uploading: false,
          progress: 0,
          error: uploadError,
          fileList: prev => [...prev.filter(f => f.uid !== uploadFile.uid), uploadFile],
        });
        
        onError?.(uploadError, file as File);
        onAntdError?.(uploadError);
        showNotificationMessage('error', '上传失败', `${(file as File).name}: ${uploadError.message}`);
      }
    },

    // 文件变化处理
    onChange: ({ fileList }) => {
      updateState({ fileList });
    },

    // 文件移除处理
    onRemove: (file) => {
      removeFile(file.uid);
      return true;
    },

    // 上传前验证
    beforeUpload: (file) => {
      try {
        // 文件大小验证
        const maxSize = uploadOptions.maxSize || presetConfig.maxSize;
        if (maxSize && file.size > maxSize) {
          showNotificationMessage('error', '文件大小超限', `文件大小不能超过 ${formatFileSize(maxSize)}`);
          return false;
        }

        // 文件类型验证
        const allowedTypes = presetConfig.accept?.split(',') || [];
        if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
          showNotificationMessage('error', '文件类型不支持', `不支持的文件类型: ${file.type}`);
          return false;
        }

        return true; // 允许上传，触发 customRequest
      } catch (error) {
        showNotificationMessage('error', '文件验证失败', '请检查文件是否有效');
        return false;
      }
    },
  }), [
    multiple,
    maxCount,
    accept,
    presetConfig,
    state.fileList,
    uploadOptions,
    updateState,
    removeFile,
    showNotificationMessage,
  ]);

  return {
    // 状态
    ...state,
    
    // 方法
    upload,
    uploadMultiple,
    clearFiles,
    removeFile,
    reset,
    
    // Ant Design Upload Props
    uploadProps,
  };
};