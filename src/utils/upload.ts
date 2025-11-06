import { fetchClinet } from '@/api'

/**
 * 获取图片完整 URL
 * @param relativePath 相对路径（如 uploads/images/2025/11/xxx.png）
 * @returns 完整的图片 URL
 */
export function getImageUrl(relativePath: string): string {
  if (!relativePath) return ''
  // 如果已经是完整 URL，直接返回
  if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
    return relativePath
  }
  // 拼接 OSS URL
  const ossUrl = import.meta.env.VITE_OSS_URL || ''
  if (!ossUrl) return relativePath

  // 确保 ossUrl 末尾没有斜杠，relativePath 前面有斜杠
  const baseUrl = ossUrl.endsWith('/') ? ossUrl.slice(0, -1) : ossUrl
  const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`

  return `${baseUrl}${path}`
}

/**
 * 上传进度回调函数类型
 */
export type UploadProgressCallback = (percent: number) => void

/**
 * 上传结果
 */
export interface UploadResult {
  /** 文件在 R2 中的 key（文件名） */
  key: string
  /** 文件访问 URL（如果有配置 CDN 域名，这里应该返回完整 URL） */
  url: string
}

/**
 * 上传配置
 */
export interface UploadOptions {
  /** 上传进度回调 */
  onProgress?: UploadProgressCallback
  /** 是否生成唯一文件名（默认 true） */
  generateUniqueName?: boolean
}

/**
 * 生成唯一文件名
 * @param file 文件对象
 * @returns 唯一文件名，格式：uploads/images/{year}/{month}/{uuid}.{ext}（不带前导斜杠，用于 R2 key）
 */
export function generateFileName(file: File): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')

  // 生成 UUID（简化版）
  const uuid = crypto.randomUUID()

  // 获取文件扩展名
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'

  // 格式：uploads/images/2025/11/abc123.jpg（R2 key 不带前导斜杠）
  return `uploads/images/${year}/${month}/${uuid}.${ext}`
}

/**
 * 验证图片文件
 * @param file 文件对象
 * @param maxSize 最大文件大小（字节），默认 5MB
 * @returns 验证结果，如果验证失败返回错误信息
 */
export function validateImageFile(file: File, maxSize: number = 5 * 1024 * 1024): { valid: boolean, error?: string } {
  // 检查文件类型
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: '只能上传图片文件' }
  }

  // 检查文件大小
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / 1024 / 1024).toFixed(1)
    return { valid: false, error: `文件大小不能超过 ${maxSizeMB}MB` }
  }

  return { valid: true }
}

/**
 * 上传文件到 Cloudflare R2
 * @param file 要上传的文件
 * @param options 上传配置
 * @returns Promise<UploadResult> 上传结果
 */
export async function uploadToR2(
  file: File,
  options: UploadOptions = {},
): Promise<UploadResult> {
  const { onProgress, generateUniqueName = true } = options

  // 生成文件名
  const fileName = generateUniqueName ? generateFileName(file) : file.name
  const fileType = file.type

  try {
    // 第一步：获取预签名 URL
    const response = await fetchClinet.POST('/api/admin/resources/object-storage/upload', {
      body: {
        fileName,
        fileType,
      },
    })

    if (response.error || !response.data) {
      throw new Error('获取上传地址失败')
    }

    const { url: uploadUrl } = response.data.data

    // 第二步：使用 XMLHttpRequest 上传文件到 R2（支持进度回调）
    await uploadFileWithProgress(uploadUrl, file, fileType, onProgress)

    // 第三步：返回上传结果（带前导斜杠，用于保存到数据库）
    return {
      key: fileName,
      url: `/${fileName}`, // 保存到数据库时带 /
    }
  }
  catch (error) {
    console.error('上传失败:', error)
    throw error instanceof Error ? error : new Error('上传失败，请重试')
  }
}

/**
 * 使用 XMLHttpRequest 上传文件（支持进度回调）
 * @param uploadUrl 预签名上传 URL
 * @param file 文件对象
 * @param contentType 文件类型
 * @param onProgress 进度回调
 */
function uploadFileWithProgress(
  uploadUrl: string,
  file: File,
  contentType: string,
  onProgress?: UploadProgressCallback,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // 监听上传进度
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100)
          onProgress(percent)
        }
      })
    }

    // 监听上传完成
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      }
      else {
        reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`))
      }
    })

    // 监听上传错误
    xhr.addEventListener('error', () => {
      reject(new Error('网络错误，上传失败'))
    })

    // 监听上传超时
    xhr.addEventListener('timeout', () => {
      reject(new Error('上传超时，请重试'))
    })

    // 发起 PUT 请求
    xhr.open('PUT', uploadUrl)
    xhr.setRequestHeader('Content-Type', contentType)
    xhr.timeout = 60000 // 60秒超时
    xhr.send(file)
  })
}
