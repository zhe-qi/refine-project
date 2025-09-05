/**
 * R2 对象存储上传组件
 * 基于 useR2Upload Hook 和 Ant Design Upload 组件封装
 * 提供开箱即用的文件上传功能
 */

import type { UploadFile } from 'antd'
import type { UseR2UploadOptions } from '@/hooks/useR2Upload'
import {
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  InboxOutlined,
  LoadingOutlined,
  PlusOutlined,
  UploadOutlined,
} from '@ant-design/icons'
import { Alert, Button, Progress, Space, Typography, Upload } from 'antd'
import React from 'react'
import { formatFileSize } from '@/config/upload'
import { useR2Upload } from '@/hooks/useR2Upload'

const { Dragger } = Upload
const { Text } = Typography

// 组件配置选项
export interface R2UploadProps extends UseR2UploadOptions {
  /** 上传区域类型 */
  uploadType?: 'button' | 'dragger'
  /** 组件样式类名 */
  className?: string
  /** 组件样式 */
  style?: React.CSSProperties
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
  /** 是否禁用上传 */
  disabled?: boolean
  /** 列表类型 */
  listType?: 'text' | 'picture' | 'picture-card'
  /** 是否显示错误信息 */
  showError?: boolean
  /** 子节点 */
  children?: React.ReactNode
}

/**
 * 文件列表项组件
 */
const FileListItem: React.FC<{
  file: UploadFile
  onRemove: (uid: string) => void
  onPreview?: (file: UploadFile) => void
}> = ({ file, onRemove, onPreview }) => {
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'done': return '#52c41a'
      case 'error': return '#ff4d4f'
      case 'uploading': return '#1890ff'
      default: return '#8c8c8c'
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 0',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div style={{ flex: 1 }}>
        <Text strong style={{ color: getStatusColor(file.status) }}>
          {file.name}
        </Text>
        <br />
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {file.size && formatFileSize(file.size)}
          {file.status === 'done' && ' • 上传完成'}
          {file.status === 'error' && ' • 上传失败'}
          {file.status === 'uploading' && ' • 上传中...'}
        </Text>
      </div>

      <Space>
        {file.status === 'done' && file.url && (
          <>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onPreview?.(file)}
              title="预览"
            />
            <Button
              type="text"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => window.open(file.url, '_blank')}
              title="下载"
            />
          </>
        )}
        <Button
          type="text"
          size="small"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onRemove(file.uid)}
          title="删除"
        />
      </Space>
    </div>
  )
}

/**
 * R2Upload 主组件
 */
export const R2Upload: React.FC<R2UploadProps> = ({
  uploadType = 'dragger',
  className,
  style,
  showProgress = true,
  showFileList = true,
  buttonText = '上传文件',
  dragText = '点击或拖拽文件到此区域上传',
  dragHint = '支持单个或批量上传，严格遵循文件类型和大小限制',
  disabled = false,
  listType,
  showError = true,
  children,
  ...uploadOptions
}) => {
  const {
    uploading,
    progress,
    fileList,
    error,
    uploadProps,
    removeFile,
    clearFiles,
  } = useR2Upload(uploadOptions)

  // 根据 fileUsage 动态设置 listType
  const getListType = (): 'text' | 'picture' | 'picture-card' | 'picture-circle' => {
    if (listType)
      return listType // 如果明确指定了 listType，使用指定的

    switch (uploadOptions.fileUsage) {
      case 'avatar':
        return 'picture-card'
      case 'image':
        return 'picture'
      case 'document':
      case 'file':
      case 'general':
      default:
        return 'text'
    }
  }

  const finalListType = getListType()

  // 文件预览处理
  const handlePreview = (file: UploadFile) => {
    if (file.url) {
      // 根据文件类型决定预览方式
      const isImage = file.type?.startsWith('image/')
      if (isImage) {
        // 图片预览（可以后续集成图片预览组件）
        window.open(file.url, '_blank')
      }
      else {
        // 其他文件直接下载
        window.open(file.url, '_blank')
      }
    }
  }

  // 渲染上传区域
  const renderUploadArea = () => {
    const commonProps = {
      ...uploadProps,
      disabled: disabled || uploading,
      onPreview: handlePreview,
      listType: finalListType,
    }

    if (children) {
      return (
        <Upload {...commonProps}>
          {children}
        </Upload>
      )
    }

    if (uploadType === 'dragger') {
      return (
        <Dragger {...commonProps} className={className} style={style}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">{dragText}</p>
          <p className="ant-upload-hint">{dragHint}</p>
        </Dragger>
      )
    }

    return (
      <Upload {...commonProps} className={className} style={style}>
        <Button
          icon={<UploadOutlined />}
          loading={uploading}
          disabled={disabled}
        >
          {uploading ? '上传中...' : buttonText}
        </Button>
      </Upload>
    )
  }

  return (
    <div style={{ width: '100%' }}>
      {/* 上传区域 */}
      {renderUploadArea()}

      {/* 上传进度 */}
      {showProgress && uploading && (
        <div style={{ marginTop: 16 }}>
          <Progress
            percent={progress}
            status={progress === 100 ? 'success' : 'active'}
            size="small"
          />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            正在上传...
            {' '}
            {progress}
            %
          </Text>
        </div>
      )}

      {/* 错误信息 */}
      {showError && error && (
        <Alert
          type="error"
          message="上传失败"
          description={error.message}
          closable
          style={{ marginTop: 16 }}
        />
      )}

      {/* 自定义文件列表 */}
      {showFileList && fileList.length > 0 && finalListType === 'text' && (
        <div style={{ marginTop: 16 }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8,
          }}
          >
            <Text strong>
              文件列表 (
              {fileList.length}
              )
            </Text>
            <Button
              type="link"
              size="small"
              onClick={clearFiles}
              disabled={uploading}
            >
              清空
            </Button>
          </div>

          <div style={{
            border: '1px solid #d9d9d9',
            borderRadius: '6px',
            maxHeight: '300px',
            overflowY: 'auto',
            padding: '8px 12px',
            backgroundColor: '#fafafa',
          }}
          >
            {fileList.map(file => (
              <FileListItem
                key={file.uid}
                file={file}
                onRemove={removeFile}
                onPreview={handlePreview}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// 导出预设配置的组件变体
export const R2ImageUpload: React.FC<Omit<R2UploadProps, 'preset'>> = props => (
  <R2Upload
    {...props}
    preset="imageOnly"
    fileUsage="image"
    dragText="点击或拖拽图片到此区域上传"
    dragHint="支持 JPG, PNG, GIF, WebP, SVG 格式，最大 10MB"
  />
)

export const R2AvatarUpload: React.FC<Omit<R2UploadProps, 'preset'> & { limit?: number }> = ({ limit = 1, ...props }) => {
  const {
    uploading,
    fileList,
    uploadProps,
  } = useR2Upload({
    ...props,
    preset: 'avatar' as const,
    fileUsage: 'avatar' as const,
    maxCount: limit,
  })

  // 当文件数量达到限制时，不显示上传按钮
  const showUploadButton = fileList.length < limit

  return (
    <Upload
      {...uploadProps}
      listType="picture-card"
    >
      {showUploadButton && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        >
          {uploading
            ? (
                <LoadingOutlined style={{ fontSize: '20px', color: '#666' }} />
              )
            : (
                <PlusOutlined style={{ fontSize: '20px', color: '#666' }} />
              )}
          <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
            {uploading ? '上传中...' : '上传头像'}
          </div>
        </div>
      )}
    </Upload>
  )
}

export const R2DocumentUpload: React.FC<Omit<R2UploadProps, 'preset'>> = props => (
  <R2Upload
    {...props}
    preset="documentOnly"
    fileUsage="document"
    dragText="点击或拖拽文档到此区域上传"
    dragHint="支持 PDF, Word, Excel, PPT, 文本文件，最大 50MB"
  />
)

export const R2ButtonUpload: React.FC<Omit<R2UploadProps, 'uploadType'>> = props => (
  <R2Upload
    {...props}
    uploadType="button"
  />
)

export default R2Upload
