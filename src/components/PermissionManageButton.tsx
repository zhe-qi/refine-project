import { KeyOutlined } from '@ant-design/icons'
import { useCan } from '@refinedev/core'
import { Button } from 'antd'

interface PermissionManageButtonProps {
  roleId: string
  onManagePermissions: (roleId: string) => void
}

export function PermissionManageButton({
  roleId,
  onManagePermissions,
}: PermissionManageButtonProps) {
  // 权限检查：需要三个权限才能管理角色权限
  // 1. GET /system/roles/{id}/permissions - 获取角色权限
  const { data: canGetPermissions } = useCan({
    resource: 'roles',
    action: 'show',
    params: { id: roleId },
  })

  // 2. POST /system/roles/{id}/permissions - 分配权限
  const { data: canAddPermissions } = useCan({
    resource: 'roles', 
    action: 'edit',
    params: { id: roleId },
  })

  // 3. DELETE /system/roles/{id}/permissions - 删除权限  
  const { data: canDeletePermissions } = useCan({
    resource: 'roles',
    action: 'delete', 
    params: { id: roleId },
  })

  // 只有拥有所有三个权限才显示按钮
  const hasAllPermissions = canGetPermissions?.can && canAddPermissions?.can && canDeletePermissions?.can

  if (!hasAllPermissions) {
    return null
  }

  return (
    <Button
      type="text"
      size="small"
      icon={<KeyOutlined />}
      onClick={() => onManagePermissions(roleId)}
      title="分配权限"
    />
  )
}
