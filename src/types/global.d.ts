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
}
