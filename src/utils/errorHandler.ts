/* eslint-disable react-hooks-extra/no-unnecessary-use-prefix */
import type { HttpError } from '@refinedev/core'

/**
 * Zod v4 错误格式
 */
interface ZodError {
  issues: Array<{
    message: string
    path: string[]
    code: string
  }>
}

/**
 * 后端响应错误格式
 */
interface BackendErrorResponse {
  error: ZodError
  message?: string
}

/**
 * 错误转换器类型
 */
type ErrorTransformer = (error: any) => HttpError

/**
 * Zod 错误转换器 - 将 Zod v4 格式转换为 Refine 需要的格式
 */
const zodErrorTransformer: ErrorTransformer = (error: any): HttpError => {
  const response = error.response?.data as any
  
  // 处理新的 ZodError 格式: { name: "ZodError", message: "[{...}]" }
  if (response?.name === 'ZodError' && response?.message) {
    try {
      const issues = JSON.parse(response.message)
      if (Array.isArray(issues)) {
        // 提取所有 issue 的 message
        const messages = issues.map((issue: any) => issue.message).filter(Boolean)
        const combinedMessage = messages.length > 0 ? messages.join('; ') : '未授权'

        return {
          message: combinedMessage,
          statusCode: error.response?.status || 500,
          errors: issues.reduce((acc: Record<string, string[]>, issue: any) => {
            const field = Array.isArray(issue.path) ? issue.path.join('.') : 'general'
            if (!acc[field]) {
              acc[field] = []
            }
            if (issue.message) {
              acc[field].push(issue.message)
            }
            return acc
          }, {}),
        }
      }
    } catch {
      // JSON 解析失败，使用原始 message
      return {
        message: response.message || '解析错误信息失败',
        statusCode: error.response?.status || 500,
      }
    }
  }

  // 处理旧的 ZodError 格式: { error: { issues: [...] } }
  if (response?.error?.issues && Array.isArray(response.error.issues)) {
    // 合并所有 issue 的 message
    const messages = response.error.issues.map((issue: any) => issue.message)
    const combinedMessage = messages.join('; ')

    return {
      message: combinedMessage,
      statusCode: error.response?.status || 500,
      errors: response.error.issues.reduce((acc: Record<string, string[]>, issue: any) => {
        const field = issue.path.join('.')
        if (!acc[field]) {
          acc[field] = []
        }
        acc[field].push(issue.message)
        return acc
      }, {}),
    }
  }

  // 如果不是 Zod 格式，使用基本的错误处理
  return {
    message: response?.message || error.message || 'An error occurred',
    statusCode: error.response?.status || 500,
  }
}

/**
 * 简单消息错误转换器 - 只提取 message 字段
 */
const simpleMessageTransformer: ErrorTransformer = (error: any): HttpError => {
  const response = error.response?.data

  return {
    message: response?.message || error.message || 'An error occurred',
    statusCode: error.response?.status || 500,
  }
}

/**
 * 可插拔的错误处理配置
 */
class ErrorHandlerConfig {
  private transformer: ErrorTransformer = zodErrorTransformer

  /**
   * 设置错误转换器
   */
  setTransformer(transformer: ErrorTransformer) {
    this.transformer = transformer
  }

  /**
   * 获取当前错误转换器
   */
  getTransformer(): ErrorTransformer {
    return this.transformer
  }

  /**
   * 使用 Zod 错误转换器
   */
  useZodTransformer() {
    this.setTransformer(zodErrorTransformer)
  }

  /**
   * 使用简单消息转换器
   */
  useSimpleMessageTransformer() {
    this.setTransformer(simpleMessageTransformer)
  }
}

// 全局错误处理配置实例
export const errorHandlerConfig = new ErrorHandlerConfig()

/**
 * 统一处理API错误
 * 使用配置的错误转换器来处理错误
 */
export function handleError(error: any): never {
  const transformer = errorHandlerConfig.getTransformer()
  const httpError = transformer(error)
  throw httpError
}

// 导出错误转换器供直接使用
export { simpleMessageTransformer, zodErrorTransformer }
export type { BackendErrorResponse, ErrorTransformer, ZodError }
