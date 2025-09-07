import { authProvider } from '@/providers/authProvider'
import { accessControlProvider, clearPermissionCache } from '@/providers/accessControl'

/**
 * 调试权限工具
 */
export async function debugPermissions() {
  console.group('🔍 权限调试信息')
  
  try {
    // 1. 获取用户身份信息
    const identity = await authProvider.getIdentity?.()
    console.log('👤 用户信息:', identity)
    
    // 2. 获取原始权限数据
    const permissions = await authProvider.getPermissions?.()
    console.log('📋 原始权限数据:', permissions)
    
    // 3. 测试具体资源权限
    const testCases = [
      { resource: 'users', action: 'list' },
      { resource: 'users', action: 'create' },
      { resource: 'users', action: 'edit' },
      { resource: 'users', action: 'delete' },
      { resource: 'roles', action: 'list' },
      { resource: 'permissions', action: 'list' },
    ]
    
    console.log('🧪 权限测试结果:')
    for (const test of testCases) {
      const result = await accessControlProvider.can!(test)
      console.log(`  ${test.resource}:${test.action} = ${result.can ? '✅' : '❌'}`)
    }
    
  } catch (error) {
    console.error('❌ 调试失败:', error)
  }
  
  console.groupEnd()
}

// 将函数挂载到 window 对象以便在控制台调用
if (typeof window !== 'undefined') {
  (window as any).debugPermissions = debugPermissions
  (window as any).clearPermissionCache = clearPermissionCache
}