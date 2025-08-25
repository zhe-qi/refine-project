import { useCan } from '@refinedev/core'
import { Button } from 'antd'

interface RoleManageButtonProps {
  userId: string
  onManageRoles: (userId: string) => void
}

export function RoleManageButton({ userId, onManageRoles }: RoleManageButtonProps) {
  const { data: canAddRoles } = useCan({
    resource: 'users',
    action: 'addRole',
    params: { id: userId },
  })

  const { data: canRemoveRoles } = useCan({
    resource: 'users',
    action: 'removeRole',
    params: { id: userId },
  })

  const { data: canListRoles } = useCan({
    resource: 'roles',
    action: 'list',
  })

  // 需要有添加角色、删除角色、以及角色列表的权限才能显示按钮
  const shouldShowButton = (canAddRoles?.can || canRemoveRoles?.can) && canListRoles?.can

  if (!shouldShowButton) {
    return null
  }

  return (
    <Button
      size="small"
      type="primary"
      ghost
      onClick={() => onManageRoles(userId)}
    >
      角色
    </Button>
  )
}
