export {}

// 声明全局
declare global {
  interface CustomRequestOptions {
    skipAuth?: boolean
    timeout?: number
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    params?: Record<string, any>
    data?: any
    headers?: Record<string, string>
  }

  // R2 上传相关类型
  namespace R2Upload {
    /** 文件上传状态 */
    type UploadStatus = 'pending' | 'uploading' | 'success' | 'error'

    /** 文件类型预设 */
    type FileTypePreset = 'imageOnly' | 'documentOnly' | 'imageAndDocument' | 'all'

    /** 上传结果 */
    interface UploadResult {
      /** 文件URL */
      url: string
      /** 文件名 */
      fileName: string
      /** 文件大小 */
      fileSize: number
      /** 文件类型 */
      fileType: string
      /** 上传耗时 */
      duration: number
    }

    /** 上传错误信息 */
    interface UploadError {
      /** 错误代码 */
      code: string
      /** 错误消息 */
      message: string
      /** 错误详情 */
      details?: any
    }

    /** 文件验证规则 */
    interface FileValidation {
      /** 最大文件大小（字节） */
      maxSize?: number
      /** 允许的文件类型 */
      allowedTypes?: string[]
      /** 允许的文件扩展名 */
      allowedExtensions?: string[]
    }

    /** 上传配置 */
    interface UploadConfig extends FileValidation {
      /** 最大文件数量 */
      maxCount?: number
      /** 是否允许多文件上传 */
      multiple?: boolean
      /** 是否生成唯一文件名 */
      generateUniqueName?: boolean
      /** 文件类型预设 */
      preset?: FileTypePreset
    }

    /** 上传进度信息 */
    interface UploadProgress {
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
    }
  }

  // 扩展 Window 接口用于文件预览
  interface Window {
    /** 文件预览回调 */
    __R2_UPLOAD_PREVIEW__?: (file: File, url: string) => void
  }
}
