/**
 * 错误处理配置示例
 *
 * 这个文件展示了如何配置和切换不同的错误处理格式
 */

// import { errorHandlerConfig, simpleMessageTransformer, zodErrorTransformer } from '@/utils/errorHandler'
import { errorHandlerConfig } from '@/utils/errorHandler'

// 默认使用 Zod v4 错误格式
// errorHandlerConfig 已经默认设置为 zodErrorTransformer

// 如果你想切换到简单的 message 格式，可以这样做：
// errorHandlerConfig.useSimpleMessageTransformer()

// 或者直接设置转换器：
// errorHandlerConfig.setTransformer(simpleMessageTransformer)

// 你也可以创建自定义的错误转换器
// function customErrorTransformer(error: any) {
//   const response = error.response?.data

//   // 自定义错误格式处理逻辑
//   if (response?.errors && Array.isArray(response.errors)) {
//     return {
//       message: response.errors.map((e: any) => e.msg || e.message).join('; '),
//       statusCode: error.response?.status || 500,
//       errors: response.errors.reduce((acc: any, err: any) => {
//         if (err.field) {
//           acc[err.field] = [err.msg || err.message]
//         }
//         return acc
//       }, {}),
//     }
//   }

//   return {
//     message: response?.message || error.message || 'An error occurred',
//     statusCode: error.response?.status || 500,
//   }
// }

// 使用自定义转换器：
// errorHandlerConfig.setTransformer(customErrorTransformer)

export { errorHandlerConfig }
