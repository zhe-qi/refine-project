// 认证工具函数
export const TOKEN_KEY = 'accessToken'

// 解析JWT令牌
export function parseJWT(token: string) {
  try {
    const base64Payload = token.split('.')[1]
    const payload = JSON.parse(atob(base64Payload))
    return payload
  } catch {
    return null
  }
}

// 检查令牌是否过期
export function isTokenExpired(token: string): boolean {
  const payload = parseJWT(token)
  if (!payload || !payload.exp) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  // 提前5分钟判断为过期，避免边界情况
  return payload.exp <= (currentTime + 300)
}

// 获取令牌
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

// 设置令牌
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
  // 当设置新令牌时，触发认证状态更新事件
  window.dispatchEvent(new CustomEvent('auth:token-updated', { detail: { token } }))
}

// 清除令牌
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  // 当清除令牌时，触发认证状态清除事件
  window.dispatchEvent(new CustomEvent('auth:token-cleared'))
}

// 检查令牌是否有效
export function isTokenValid(): boolean {
  const token = getToken()
  if (!token) return false
  return !isTokenExpired(token)
}

// 获取令牌剩余有效时间(秒)
export function getTokenRemainingTime(): number {
  const token = getToken()
  if (!token) return 0
  
  const payload = parseJWT(token)
  if (!payload || !payload.exp) return 0
  
  const currentTime = Math.floor(Date.now() / 1000)
  return Math.max(0, payload.exp - currentTime)
}

// 防抖函数，用于限制频繁的认证检查
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>): void => {
    if (timeout) {
      clearTimeout(timeout)
    }
    
    timeout = setTimeout(() => {
      func.apply(null, args)
      timeout = null
    }, wait)
  }
}