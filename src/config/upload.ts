/**
 * R2 对象存储上传配置
 */

// 支持的文件类型配置
export const SUPPORTED_FILE_TYPES = {
  // 图片类型
  images: {
    extensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    maxSize: 10 * 1024 * 1024, // 10MB
    description: '支持 JPG, PNG, GIF, WebP, SVG 格式，最大 10MB',
  },

  // 文档类型
  documents: {
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
    ],
    maxSize: 50 * 1024 * 1024, // 50MB
    description: '支持 PDF, Word, Excel, PPT, 文本文件，最大 50MB',
  },

  // 视频类型
  videos: {
    extensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm'],
    mimeTypes: ['video/mp4', 'video/avi', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/webm'],
    maxSize: 100 * 1024 * 1024, // 100MB
    description: '支持 MP4, AVI, MOV, WMV, FLV, WebM 格式，最大 100MB',
  },

  // 音频类型
  audios: {
    extensions: ['.mp3', '.wav', '.aac', '.flac', '.ogg'],
    mimeTypes: ['audio/mpeg', 'audio/wav', 'audio/aac', 'audio/flac', 'audio/ogg'],
    maxSize: 20 * 1024 * 1024, // 20MB
    description: '支持 MP3, WAV, AAC, FLAC, OGG 格式，最大 20MB',
  },

  // 压缩文件
  archives: {
    extensions: ['.zip', '.rar', '.7z', '.tar', '.gz'],
    mimeTypes: [
      'application/zip',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',
    ],
    maxSize: 100 * 1024 * 1024, // 100MB
    description: '支持 ZIP, RAR, 7Z, TAR, GZ 格式，最大 100MB',
  },
}

// 默认上传配置
export const DEFAULT_UPLOAD_CONFIG = {
  // 最大文件大小 (50MB)
  maxFileSize: 50 * 1024 * 1024,

  // 最大同时上传文件数量
  maxCount: 5,

  // 是否允许多文件上传
  multiple: true,

  // 默认支持所有文件类型
  acceptedTypes: Object.values(SUPPORTED_FILE_TYPES).flatMap(type => type.mimeTypes),

  // 默认文件扩展名
  acceptedExtensions: Object.values(SUPPORTED_FILE_TYPES).flatMap(type => type.extensions),

  // 上传路径前缀
  pathPrefix: {
    authenticated: 'users', // 已认证用户文件路径
    anonymous: 'public', // 匿名用户文件路径
  },
}

// 常用文件类型预设
export const FILE_TYPE_PRESETS = {
  // 仅图片
  imageOnly: {
    accept: SUPPORTED_FILE_TYPES.images.mimeTypes.join(','),
    extensions: SUPPORTED_FILE_TYPES.images.extensions,
    maxSize: SUPPORTED_FILE_TYPES.images.maxSize,
    description: SUPPORTED_FILE_TYPES.images.description,
  },

  // 头像专用 - 更严格的限制
  avatar: {
    accept: ['image/jpeg', 'image/png', 'image/webp'].join(','),
    extensions: ['.jpg', '.jpeg', '.png', '.webp'],
    maxSize: 5 * 1024 * 1024, // 5MB
    description: '支持 JPG, PNG, WebP 格式，最大 5MB，推荐 1:1 比例',
  },

  // 仅文档
  documentOnly: {
    accept: SUPPORTED_FILE_TYPES.documents.mimeTypes.join(','),
    extensions: SUPPORTED_FILE_TYPES.documents.extensions,
    maxSize: SUPPORTED_FILE_TYPES.documents.maxSize,
    description: SUPPORTED_FILE_TYPES.documents.description,
  },

  // 图片和文档
  imageAndDocument: {
    accept: [
      ...SUPPORTED_FILE_TYPES.images.mimeTypes,
      ...SUPPORTED_FILE_TYPES.documents.mimeTypes,
    ].join(','),
    extensions: [
      ...SUPPORTED_FILE_TYPES.images.extensions,
      ...SUPPORTED_FILE_TYPES.documents.extensions,
    ],
    maxSize: Math.max(SUPPORTED_FILE_TYPES.images.maxSize, SUPPORTED_FILE_TYPES.documents.maxSize),
    description: '支持图片和文档文件',
  },

  // 所有类型
  all: {
    accept: DEFAULT_UPLOAD_CONFIG.acceptedTypes.join(','),
    extensions: DEFAULT_UPLOAD_CONFIG.acceptedExtensions,
    maxSize: DEFAULT_UPLOAD_CONFIG.maxFileSize,
    description: '支持所有文件类型',
  },
}

// 错误消息
export const UPLOAD_ERROR_MESSAGES = {
  FILE_TOO_LARGE: '文件大小超过限制',
  FILE_TYPE_NOT_SUPPORTED: '不支持的文件类型',
  UPLOAD_FAILED: '文件上传失败',
  NETWORK_ERROR: '网络错误，请检查网络连接',
  SERVER_ERROR: '服务器错误，请稍后重试',
  FILE_COUNT_EXCEEDED: '文件数量超过限制',
  INVALID_FILE: '无效的文件',
  TOKEN_EXPIRED: '上传凭证已过期，请重新获取',
}

// 文件大小格式化工具
export function formatFileSize(bytes: number): string {
  if (bytes === 0)
    return '0 B'

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
}

// 验证文件类型
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type)
}

// 验证文件大小
export function validateFileSize(file: File, maxSize: number): boolean {
  return file.size <= maxSize
}

// 生成唯一文件名
export function generateUniqueFileName(originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const extension = originalName.substring(originalName.lastIndexOf('.'))
  const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'))

  return `${nameWithoutExt}_${timestamp}_${random}${extension}`
}
