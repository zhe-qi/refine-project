import { useRef, useState } from 'react'
import { Upload, X } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { getImageUrl, uploadToR2, validateImageFile } from '@/utils/upload'

export interface ImageUploadProps {
  /** 已上传的图片 URL */
  value?: string | string[]
  /** 值变化回调 */
  onChange?: (value: string | string[]) => void
  /** 上传数量限制（默认 1，单图上传） */
  limit?: number
  /** 单文件大小限制（默认 5MB） */
  maxSize?: number
  /** 接受的文件类型（默认 image/*） */
  accept?: string
  /** 是否禁用 */
  disabled?: boolean
  /** 自定义类名 */
  className?: string
}

interface UploadingFile {
  id: string
  file: File
  preview: string
  progress: number
}

export function ImageUpload({
  value,
  onChange,
  limit = 1,
  maxSize = 5 * 1024 * 1024,
  accept = 'image/*',
  disabled = false,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([])

  // 标准化 value 为数组格式
  const isSingleMode = limit === 1 || !limit
  const currentUrls = !value
    ? []
    : Array.isArray(value)
      ? value
      : [value]

  // 当前已上传的图片数量
  const currentCount = currentUrls.length + uploadingFiles.length

  // 是否可以继续上传
  const canUpload = currentCount < limit && !disabled

  // 处理文件选择
  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0)
      return

    const filesArray = Array.from(files)

    // 检查数量限制
    const remainingSlots = limit - currentCount
    if (filesArray.length > remainingSlots) {
      toast.error(`最多只能上传 ${limit} 张图片`)
      return
    }

    // 验证并上传每个文件
    for (const file of filesArray) {
      // 验证文件
      const validation = validateImageFile(file, maxSize)
      if (!validation.valid) {
        toast.error(validation.error)
        continue
      }

      // 生成预览
      const preview = URL.createObjectURL(file)
      const fileId = crypto.randomUUID()

      // 添加到上传中列表
      const uploadingFile: UploadingFile = {
        id: fileId,
        file,
        preview,
        progress: 0,
      }

      setUploadingFiles(prev => [...prev, uploadingFile])

      // 开始上传
      try {
        const result = await uploadToR2(file, {
          onProgress: (percent) => {
            setUploadingFiles(prev =>
              prev.map(f =>
                f.id === fileId ? { ...f, progress: percent } : f,
              ),
            )
          },
        })

        // 上传成功，移除预览，添加到结果
        URL.revokeObjectURL(preview)
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId))

        // 更新 value
        const newUrls = [...currentUrls, result.url]
        if (isSingleMode) {
          onChange?.(newUrls[0] ?? '')
        }
        else {
          onChange?.(newUrls)
        }

        toast.success('上传成功')
      }
      catch (error) {
        console.error('上传失败:', error)
        URL.revokeObjectURL(preview)
        setUploadingFiles(prev => prev.filter(f => f.id !== fileId))
        toast.error(error instanceof Error ? error.message : '上传失败')
      }
    }
  }

  // 处理删除图片
  const handleRemove = (index: number) => {
    const newUrls = currentUrls.filter((_, i) => i !== index)
    if (isSingleMode) {
      onChange?.(newUrls[0] || '')
    }
    else {
      onChange?.(newUrls)
    }
  }

  // 处理点击上传按钮
  const handleUploadClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* 图片网格 */}
      <div className="grid grid-cols-4 gap-4">
        {/* 已上传的图片 */}
        {currentUrls.map((url, index) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
          >
            <img
              src={getImageUrl(url)}
              alt={`上传的图片 ${index + 1}`}
              className="h-full w-full object-cover"
            />
            {!disabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  size="icon"
                  variant="destructive"
                  className="size-8"
                  onClick={() => handleRemove(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            )}
          </div>
        ))}

        {/* 正在上传的图片 */}
        {uploadingFiles.map(file => (
          <div
            key={file.id}
            className="relative aspect-square overflow-hidden rounded-lg border bg-muted"
          >
            <img
              src={file.preview}
              alt="上传中"
              className="h-full w-full object-cover opacity-50"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50">
              <Progress value={file.progress} className="w-3/4" />
              <span className="mt-2 text-xs text-white">
                {file.progress}
                %
              </span>
            </div>
          </div>
        ))}

        {/* 上传按钮 */}
        {canUpload && (
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={disabled}
            className={cn(
              'flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <Upload className="size-6 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">上传图片</span>
          </button>
        )}
      </div>

      {/* 隐藏的文件输入 */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={!isSingleMode}
        onChange={e => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* 提示文本 */}
      <p className="text-xs text-muted-foreground">
        支持
        {' '}
        {accept}
        {' '}
        格式，单个文件不超过
        {' '}
        {(maxSize / 1024 / 1024).toFixed(0)}
        MB
        {!isSingleMode && `，最多上传 ${limit} 张`}
      </p>
    </div>
  )
}
