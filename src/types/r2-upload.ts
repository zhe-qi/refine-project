/**
 * R2 对象存储上传相关类型定义
 */

import type { UploadFile, UploadProps } from 'antd'

// ====== 基础类型 ======

/** 文件上传状态 */
export type R2UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

/** 文件类型预设枚举 */
export type R2FileTypePreset = 'imageOnly' | 'documentOnly' | 'imageAndDocument' | 'all'

/** 上传类型 */
export type R2UploadType = 'button' | 'dragger'

/** 列表类型 */
export type R2ListType = 'text' | 'picture' | 'picture-card'

// ====== 上传结果相关 ======

/** R2 上传结果 */
export interface R2UploadResult {
  /** 上传成功后的文件URL */
  url: string
  /** 文件名 */
  fileName: string
  /** 文件大小（字节） */
  fileSize: number
  /** 文件MIME类型 */
  fileType: string
  /** 上传耗时（毫秒） */
  duration: number
  /** 上传时间戳 */
  timestamp?: number
  /** 文件唯一标识 */
  fileId?: string
}

/** 批量上传结果 */
export interface R2BatchUploadResult {
  /** 成功上传的文件结果 */
  success: R2UploadResult[]
  /** 上传失败的文件信息 */
  errors: Array<{
    file: File
    error: R2UploadError
  }>
  /** 总文件数 */
  total: number
  /** 成功数量 */
  successCount: number
  /** 失败数量 */
  errorCount: number
  /** 总耗时 */
  totalDuration: number
}

// ====== 错误处理相关 ======

/** R2 上传错误 */
export interface R2UploadError extends Error {
  /** 错误代码 */
  code: string
  /** 错误消息 */
  message: string
  /** 错误详情 */
  details?: any
  /** 关联的文件信息 */
  file?: File
}

/** 错误代码枚举 */
export const R2UploadErrorCodes = {
  /** 文件过大 */
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  /** 文件类型不支持 */
  FILE_TYPE_NOT_SUPPORTED: 'FILE_TYPE_NOT_SUPPORTED',
  /** 上传失败 */
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  /** 网络错误 */
  NETWORK_ERROR: 'NETWORK_ERROR',
  /** 服务器错误 */
  SERVER_ERROR: 'SERVER_ERROR',
  /** 文件数量超限 */
  FILE_COUNT_EXCEEDED: 'FILE_COUNT_EXCEEDED',
  /** 无效文件 */
  INVALID_FILE: 'INVALID_FILE',
  /** 令牌过期 */
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  /** 未知错误 */
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type R2UploadErrorCode = (typeof R2UploadErrorCodes)[keyof typeof R2UploadErrorCodes];

// ====== 上传配置相关 ======

/** 文件验证配置 */
export interface R2FileValidation {
  /** 最大文件大小（字节） */
  maxSize?: number
  /** 允许的MIME类型数组 */
  allowedTypes?: string[]
  /** 允许的文件扩展名数组 */
  allowedExtensions?: string[]
  /** 自定义验证函数 */
  customValidator?: (file: File) => boolean | Promise<boolean>
}

/** R2 上传基础配置 */
export interface R2UploadConfig extends R2FileValidation {
  /** 最大文件数量 */
  maxCount?: number
  /** 是否支持多文件上传 */
  multiple?: boolean
  /** 是否生成唯一文件名 */
  generateUniqueName?: boolean
  /** 文件类型预设 */
  preset?: R2FileTypePreset
  /** 自定义文件名生成器 */
  fileNameGenerator?: (file: File) => string
}

/** R2 上传选项 */
export interface R2UploadOptions extends R2UploadConfig {
  /** 文件对象 */
  file?: File
  /** 自定义文件名 */
  fileName?: string
  /** 上传进度回调 */
  onProgress?: (progress: number) => void
  /** 上传成功回调 */
  onSuccess?: (result: R2UploadResult, file: File) => void
  /** 上传失败回调 */
  onError?: (error: R2UploadError, file: File) => void
  /** 是否显示通知 */
  showNotification?: boolean
  /** 自定义Accept属性 */
  accept?: string
}

// ====== 进度相关 ======

/** 上传进度信息 */
export interface R2UploadProgress {
  /** 当前进度百分比 (0-100) */
  percent: number
  /** 已上传字节数 */
  loaded?: number
  /** 总字节数 */
  total?: number
  /** 上传速度（字节/秒） */
  speed?: number
  /** 预计剩余时间（秒） */
  timeRemaining?: number
  /** 当前上传的文件索引（批量上传时） */
  currentFileIndex?: number
  /** 总文件数（批量上传时） */
  totalFiles?: number
}

/** 批量上传进度回调 */
export type R2BatchUploadProgressCallback = (
  current: number,
  total: number,
  fileProgress: number,
  currentFile?: File
) => void

// ====== Hook 相关 ======

/** useR2Upload Hook 状态 */
export interface R2UploadState {
  /** 是否正在上传 */
  uploading: boolean
  /** 上传进度 (0-100) */
  progress: number
  /** 已上传完成的文件列表 */
  fileList: UploadFile[]
  /** 上传结果列表 */
  results: R2UploadResult[]
  /** 错误信息 */
  error: R2UploadError | null
}

/** useR2Upload Hook 返回值 */
export interface UseR2UploadReturn extends R2UploadState {
  /** 兼容 Ant Design Upload 组件的属性 */
  uploadProps: UploadProps
  /** 手动上传文件 */
  upload: (file: File) => Promise<R2UploadResult>
  /** 批量上传文件 */
  uploadMultiple: (files: File[]) => Promise<R2UploadResult[]>
  /** 清空文件列表 */
  clearFiles: () => void
  /** 移除指定文件 */
  removeFile: (uid: string) => void
  /** 重置上传状态 */
  reset: () => void
}

// ====== 组件相关 ======

/** R2Upload 组件基础属性 */
export interface R2UploadBaseProps extends R2UploadOptions {
  /** 组件样式类名 */
  className?: string
  /** 组件样式 */
  style?: React.CSSProperties
  /** 是否禁用上传 */
  disabled?: boolean
  /** 子节点 */
  children?: React.ReactNode
}

/** R2Upload 组件属性 */
export interface R2UploadProps extends R2UploadBaseProps {
  /** 上传区域类型 */
  uploadType?: R2UploadType
  /** 是否显示上传进度 */
  showProgress?: boolean
  /** 是否显示文件列表 */
  showFileList?: boolean
  /** 自定义上传按钮文字 */
  buttonText?: string
  /** 自定义拖拽区域文字 */
  dragText?: string
  /** 自定义拖拽区域提示文字 */
  dragHint?: string
  /** 列表类型 */
  listType?: R2ListType
  /** 是否显示错误信息 */
  showError?: boolean
  /** 自定义预览处理函数 */
  onPreview?: (file: UploadFile) => void
  /** 自定义下载处理函数 */
  onDownload?: (file: UploadFile) => void
}

// ====== 文件信息相关 ======

/** 文件元信息 */
export interface R2FileInfo {
  /** 文件名 */
  name: string
  /** 文件大小 */
  size: number
  /** 文件类型 */
  type: string
  /** 最后修改时间 */
  lastModified: number
  /** 文件扩展名 */
  extension: string
  /** 是否为图片 */
  isImage: boolean
  /** 是否为文档 */
  isDocument: boolean
  /** 文件哈希值（可选） */
  hash?: string
}

/** 扩展的上传文件信息 */
export interface R2UploadFile extends UploadFile {
  /** R2 上传结果 */
  r2Result?: R2UploadResult
  /** 文件元信息 */
  fileInfo?: R2FileInfo
  /** 上传开始时间 */
  uploadStartTime?: number
  /** 上传结束时间 */
  uploadEndTime?: number
}

// ====== 工具函数类型 ======

/** 文件大小格式化函数 */
export type FormatFileSizeFunction = (bytes: number) => string

/** 文件类型验证函数 */
export type ValidateFileTypeFunction = (file: File, allowedTypes: string[]) => boolean

/** 文件大小验证函数 */
export type ValidateFileSizeFunction = (file: File, maxSize: number) => boolean

/** 唯一文件名生成函数 */
export type GenerateUniqueFileNameFunction = (originalName: string) => string

// ====== 扩展类型 ======

/** 自定义上传适配器接口 */
export interface R2UploadAdapter {
  /** 上传方法 */
  upload: (options: R2UploadOptions) => Promise<R2UploadResult>
  /** 批量上传方法 */
  uploadMultiple?: (files: File[], options: Omit<R2UploadOptions, 'file'>) => Promise<R2UploadResult[]>
  /** 取消上传方法 */
  cancel?: (uploadId: string) => void
}

/** 上传钩子函数 */
export interface R2UploadHooks {
  /** 上传前钩子 */
  beforeUpload?: (file: File, fileList: File[]) => boolean | Promise<boolean>
  /** 上传后钩子 */
  afterUpload?: (result: R2UploadResult, file: File) => void | Promise<void>
  /** 错误处理钩子 */
  onError?: (error: R2UploadError, file: File) => void
}

export default {}
